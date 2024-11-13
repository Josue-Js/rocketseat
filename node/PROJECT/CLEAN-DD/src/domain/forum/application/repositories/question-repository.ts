import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { PaginationParams } from "@/core/repositories/pagination-params";

export abstract class QuestionRepository {
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract create(question: Question): Promise<void>;
  abstract findById(id: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
  abstract delete(question: Question): Promise<void>;
  abstract update(question: Question): Promise<void>;
}
