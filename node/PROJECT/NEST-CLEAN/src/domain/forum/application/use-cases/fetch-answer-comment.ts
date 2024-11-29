import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/valueObject/commet-with-author";
import { AnswerCommentRepository } from "../repositories/answer-comment-repository";

interface FetchAnswerCommentUseCaseRequest {
  answerId: string;
  page: number;
}
type FetchAnswerCommentUseCaseResponse = Either<
  null,
  { comments: CommentWithAuthor[] }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseResponse> {
    const comments =
      await this.answerCommentRepository.findByManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );

    return right({ comments });
  }
}
