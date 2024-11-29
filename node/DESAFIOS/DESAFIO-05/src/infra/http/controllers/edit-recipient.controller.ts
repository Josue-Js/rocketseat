import { EditRecipientUseCase } from "@/application/use-cases/edit-recipient";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";

const editRecipientBodySchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  address: z.string().optional(),
  number: z.number().optional(),
  complement: z.string().optional().nullable(),
});

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>;

@Controller("/recipient/:id")
export class EditRecipientController {
  constructor(private editRecipientUseCase: EditRecipientUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Param("id") recipient_id: string,
    @Body(new ZodValidationPipe(editRecipientBodySchema))
    body: EditRecipientBodySchema,
    @CurrentUser() user: User,
  ) {
    const { name, address, city, complement, number, zip_code, state } = body;

    await this.editRecipientUseCase.execute({
      recipient_id,
      name,
      address,
      city,
      complement,
      number,
      zip_code,
      state,
      role: user.role,
    });
  }
}
