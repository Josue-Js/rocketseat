import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from "@nestjs/common";
import { QuestionDetailsPresenter } from "../presenters/question-details-presenter";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlugUseCase: GetQuestionBySlugUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlugUseCase.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { question: QuestionDetailsPresenter.toHTTP(result.value.question) };
  }
}
