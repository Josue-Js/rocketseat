import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { QuestionBestAnswerChooseEvent } from "@/domain/forum/enterprise/entities/events/question-best-answer-choose-event";
import { Injectable } from "@nestjs/common";
import { SendNotificationUseCase } from "../use-cases/send-notification";

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswerRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChooseEvent.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    bestAnswerId,
    question,
  }: QuestionBestAnswerChooseEvent) {
    const answer = await this.answerRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: "Sua resposta foi escolhida!",
        content: `A resposta que você enviou em "${question.title.substring(0, 20).concat("...")}" foi escolhida pelo autor!`,
      });
    }
  }
}
