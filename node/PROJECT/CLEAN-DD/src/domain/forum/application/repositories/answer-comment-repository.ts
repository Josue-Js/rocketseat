import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";

export abstract class AnswerCommentRepository {
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract findById(answerCommentId: string): Promise<AnswerComment | null>;
  abstract findByManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>;
  abstract delete(answerCommentId: string): Promise<void>;
}
