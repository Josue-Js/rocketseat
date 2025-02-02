import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) { }

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(commentOnQuestionBodySchema))
    body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("questionId") questionId: string
  ) {
    const { sub: userId } = user;
    const { content } = body;

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

  }
}
