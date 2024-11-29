import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";
import { Injectable } from "@nestjs/common";

interface FetchRecentTopicsUseCaseRequest {
  page: number;
}
type FetchRecentQuestionUseCaseResponse = Either<
  null,
  { questions: Question[] }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentTopicsUseCaseRequest): Promise<FetchRecentQuestionUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page });

    return right({ questions });
  }
}
