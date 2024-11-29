import { CreateRecipientUseCase } from "@/application/use-cases/create-recipient";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";

const createRecipientBodySchema = z.object({
  name: z.string(),
  city: z.string(),
  state: z.string(),
  zip_code: z.string(),
  address: z.string(),
  number: z.coerce.number(),
  neighbourhood: z.string(),
  complement: z.string().nullable(),
});

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@Controller("/recipient")
export class CreateRecipientController {
  constructor(private createRecipientUseCase: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createRecipientBodySchema))
    body: CreateRecipientBodySchema,
    @CurrentUser() user: User,
  ) {
    const {
      name,
      address,
      city,
      neighbourhood,
      complement,
      number,
      zip_code,
      state,
    } = body;

    await this.createRecipientUseCase.execute({
      name,
      address,
      city,
      complement,
      number,
      zip_code,
      state,
      neighbourhood,
      role: user.role,
    });
  }
}
