import { CreateOrderUseCase } from "@/application/use-cases/create-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User, UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";

const createOrderBodySchema = z.object({
  recipient_id: z.string(),
  courier_id: z.string(),
});

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller("/order")
export class CreateOrderController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createOrderBodySchema))
    body: CreateOrderBodySchema,
    @CurrentUser() user: User,
  ) {
    const { courier_id, recipient_id } = body;

    await this.createOrderUseCase.execute({
      courier_id,
      recipient_id,
      role: user.role,
    });
  }
}
