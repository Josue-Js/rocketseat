import { EditOrderUseCase } from "@/application/use-cases/edit-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Param, Post, Put } from "@nestjs/common";
import { z } from "zod";

const editOrderBodySchema = z.object({
  status: z.enum(["AWAITED", "COLLECTED", "RETURNED", "DELIVERED"]).optional(),
  courier_id: z.string().optional(),
  recipient_id: z.string().optional(),
  collected_at: z.date().nullable().optional(),
  delivered_at: z.date().nullable().optional(),
});

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>;

@Controller("/order/:id")
export class EditOrderController {
  constructor(private editOrderUseCase: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param("id") order_id: string,
    @Body(new ZodValidationPipe(editOrderBodySchema))
    body: EditOrderBodySchema,
    @CurrentUser() user: User,
  ) {
    const { courier_id, recipient_id, status, collected_at, delivered_at } =
      body;

    await this.editOrderUseCase.execute({
      order_id,
      courier_id,
      recipient_id,
      status,
      collected_at,
      delivered_at,
      role: user.role,
    });
  }
}
