import { MarkOrderWithDeliveredUseCase } from "@/application/use-cases/mark-order-with-delivered";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const markOrderWithDeliveredBodySchema = z.object({
  attachments: z.array(z.string()),
});

type MarkOrderWithDeliveredBodySchema = z.infer<
  typeof markOrderWithDeliveredBodySchema
>;

@Controller("/order/:id/delivered")
export class MarkOrderWithDeliveredController {
  constructor(
    private markOrderWithDeliveredUseCase: MarkOrderWithDeliveredUseCase,
  ) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Param("id") order_id: string,
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(markOrderWithDeliveredBodySchema))
    body: MarkOrderWithDeliveredBodySchema,
  ) {
    const { attachments } = body;
    await this.markOrderWithDeliveredUseCase.execute({
      order_id,
      courier_id: user.id,
      attachments,
    });
  }
}
