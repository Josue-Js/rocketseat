import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { CommentWithAuthor } from "../../enterprise/entities/valueObject/commet-with-author";

export abstract class QuestionCommentRepository {
  abstract create(questionComment: QuestionComment): Promise<void>;
  abstract findById(questionId: string): Promise<QuestionComment | null>;
  abstract findByManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>;
  abstract findByManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>;
  abstract delete(questionComment: QuestionComment): Promise<void>;
}
