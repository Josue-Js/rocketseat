import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export abstract class AnswerRepository {
  abstract create(answer: Answer): Promise<void>;
  abstract findById(answerId: string): Promise<Answer | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>;
  abstract update(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
}
