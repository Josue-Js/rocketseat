import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/valueObject/commet-with-author";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";

interface FetchQuestionCommentUseCaseRequest {
  questionId: string;
  page: number;
}
type FetchQuestionCommentUseCaseResponse = Either<
  null,
  { comments: CommentWithAuthor[] }
>;

@Injectable()
export class FetchQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
    const comments =
      await this.questionCommentRepository.findByManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        },
      );

    return right({ comments });
  }
}
