import { AuthenticateUseCase } from "@/application/use-cases/authenticate";
import { IS_PUBLIC_KEY, Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";

const authenticateBodySchema = z.object({
  cpf: z.string().transform((value) => value.replace(/\/D/g, "")),
  password: z.string().min(6),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Public()
@Controller("/sign-in")
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body;

    const result = await this.authenticateUseCase.execute({
      cpf,
      password,
    });

    const { access_token } = result;
    return {
      access_token,
    };
  }
}
