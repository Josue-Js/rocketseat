import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachment-repository";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: QuestionAttachmentRepository
  ) {}

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question =
      this.items.find((item) => item.slug.value === slug) ?? null;

    return question;
  }

  async findById(id: string): Promise<Question | null> {
    return this.items.find((item) => item.id.toString() == id) ?? null;
  }

  async delete(question: Question): Promise<void> {
    this.items = this.items.filter((item) => item.id != question.id);

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }

  async update(question: Question): Promise<void> {
    this.items = this.items.map((item) =>
      item.id === question.id ? question : item
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }
}
