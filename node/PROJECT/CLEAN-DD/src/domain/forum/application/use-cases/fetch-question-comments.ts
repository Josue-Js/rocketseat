import { Either, right } from "@/core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";

interface FetchQuestionCommentUseCaseRequest {
  questionId: string;
  page: number;
}
type FetchQuestionCommentUseCaseResponse = Either<
  null,
  { questionComments: QuestionComment[] }
>;

export class FetchQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
    const questionComments =
      await this.questionCommentRepository.findByManyByQuestionId(questionId, {
        page,
      });

    return right({ questionComments });
  }
}
