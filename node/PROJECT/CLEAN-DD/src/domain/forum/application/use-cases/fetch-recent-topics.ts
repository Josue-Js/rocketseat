import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";

interface FetchRecentTopicsUseCaseRequest {
  page: number;
}
type FetchRecentTopicsUseCaseResponse = Either<null, { questions: Question[] }>;

export class FetchRecentTopicsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentTopicsUseCaseRequest): Promise<FetchRecentTopicsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page });

    return right({ questions });
  }
}
