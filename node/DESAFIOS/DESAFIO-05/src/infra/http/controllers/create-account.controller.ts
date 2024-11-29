import { CreateAccountUseCase } from "@/application/use-cases/create-account";
import { Public } from "@/infra/auth/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";

const createAccountBodySchema = z.object({
  name: z.string(),
  cpf: z.string().transform((value) => value.replace(/\D+/g, "")),
  password: z.string().min(6),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Public()
@Controller("/sign-up")
export class CreateAccountController {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, cpf, password } = body;

    await this.createAccountUseCase.execute({
      name,
      cpf,
      password,
    });
  }
}
