import { ResetPasswordUseCase } from "@/application/use-cases/reset-password";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { z } from "zod";

const resetPasswordBodySchema = z.object({
  new_password: z.string().min(6),
});

type ResetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>;

@Controller("/reset/password/:id")
export class ResetPasswordController {
  constructor(private resetPasswordUseCase: ResetPasswordUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Param("id") courier_id: string,
    @Body(new ZodValidationPipe(resetPasswordBodySchema))
    body: ResetPasswordBodySchema,
    @CurrentUser() user: User,
  ) {
    const { new_password } = body;

    await this.resetPasswordUseCase.execute({
      new_password,
      courier_id,
      role: user.role,
    });
  }
}
