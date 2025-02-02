import { Either, left, right } from "@/core/either";
import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionRepository
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    const question = await this.questionRepository.findById(
      answer.questionId.toString()
    );

    if (!question) return left(new ResourceNotFoundError());

    if (authorId != question.authorId.toString())
      return left(new NotAllowedError());

    question.bestAnswerId = answer.id;

    await this.questionRepository.update(question);

    return right({ question });
  }
}
