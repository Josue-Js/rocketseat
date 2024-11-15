import { Either, left, right } from "@/core/either";
import { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface DeleteAnswerCommentUseCaseRequest {
  answerCommentId: string;
  authorId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentRepository.findById(answerCommentId);

    if (!answerComment) return left(new ResourceNotFoundError());

    if (answerComment.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    await this.answerCommentRepository.delete(answerCommentId);

    return right({});
  }
}
