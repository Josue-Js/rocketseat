import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";

export abstract class QuestionCommentRepository {
  abstract create(questionComment: QuestionComment): Promise<void>;
  abstract findById(questionId: string): Promise<QuestionComment | null>;
  abstract findByManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>;
  abstract delete(questionId: string): Promise<void>;
}
