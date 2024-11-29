import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";

interface FetchQuestionAnswerUseCaseRequest {
  questionId: string;
  page: number;
}
type FetchQuestionAnswerUseCaseResponse = Either<null, { answers: Answer[] }>;

@Injectable()
export class FetchQuestionAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) { }

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswerUseCaseRequest): Promise<FetchQuestionAnswerUseCaseResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page }
    );

    return right({ answers });
  }
}
