import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";
import { QuestionRepository } from "../repositories/question-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface CommentOnQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  { questionComment: QuestionComment }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentRepository: QuestionCommentRepository
  ) {}

  async execute({
    questionId,
    authorId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) return left(new ResourceNotFoundError());

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentRepository.create(questionComment);

    return right({ questionComment });
  }
}
