import { FetchQuestionAnswerUseCase } from "@/domain/forum/application/use-cases/fetch-question-answer";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { AnswerPresenter } from "../presenters/answer-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));
const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions/:questionId/answers")
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswersUseCase: FetchQuestionAnswerUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query("page", pageValidationPipe) page: PageQueryParamsSchema,
    @Param("questionId") questionId: string
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { answers } = result.value;

    return { answers: answers.map(AnswerPresenter.toHTTP) };
  }
}
