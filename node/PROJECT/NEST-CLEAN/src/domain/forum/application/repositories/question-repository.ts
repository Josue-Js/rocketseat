import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";
import { QuestionDetails } from "../../enterprise/entities/valueObject/question-details";

export abstract class QuestionRepository {
  abstract create(question: Question): Promise<void>;
  abstract findById(id: string): Promise<Question | null>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
  abstract delete(question: Question): Promise<void>;
  abstract update(question: Question): Promise<void>;
}
