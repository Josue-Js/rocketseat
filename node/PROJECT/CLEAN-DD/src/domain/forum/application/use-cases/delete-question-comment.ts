import { Either, left, right } from "@/core/either";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string;
  authorId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFoundError, {}>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentRepository.findById(questionCommentId);

    if (!questionComment) return left(new ResourceNotFoundError());

    if (questionComment.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    await this.questionCommentRepository.delete(questionCommentId);

    return right({});
  }
}