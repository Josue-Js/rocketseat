import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Answer } from "../answer";
import { Question } from "../question";

export class QuestionBestAnswerChooseEvent implements DomainEvent {
  public question: Question;
  public ocurredAt: Date;
  public bestAnswerId: UniqueEntityID;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question;
    this.ocurredAt = new Date();
    this.bestAnswerId = bestAnswerId;
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id;
  }
}
