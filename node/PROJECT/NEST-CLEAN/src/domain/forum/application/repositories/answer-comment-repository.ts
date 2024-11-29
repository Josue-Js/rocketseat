import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { CommentWithAuthor } from "../../enterprise/entities/valueObject/commet-with-author";

export abstract class AnswerCommentRepository {
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract findById(answerCommentId: string): Promise<AnswerComment | null>;
  abstract findByManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;
  abstract findByManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
}
