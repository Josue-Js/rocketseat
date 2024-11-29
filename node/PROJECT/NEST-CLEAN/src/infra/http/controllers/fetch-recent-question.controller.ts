import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-question";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));
const pageValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
export class FetchRecentQuestionController {
  constructor(
    private fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@Query("page", pageValidationPipe) page: PageQueryParamsSchema) {
    const result = await this.fetchRecentQuestionsUseCase.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { questions } = result.value;

    return { questions: questions.map(QuestionPresenter.toHTTP) };
  }
}
