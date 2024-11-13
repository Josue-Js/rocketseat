import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = [];

  constructor(private answerAttachmentRepository: AnswerAttachmentRepository) {}

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id) ?? null;
    return answer;
  }

  async update(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[itemIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer) {
    this.items = this.items.filter((item) => item.id != answer.id);

    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }
}
