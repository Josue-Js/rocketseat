import { MarkOrderWithReturnedUseCase } from "@/application/use-cases/mark-order-with-returned";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { Controller, HttpCode, Param, Put } from "@nestjs/common";

@Controller("/order/:id/returned")
export class MarkOrderWithReturnedController {
  constructor(
    private markOrderWithReturnedUseCase: MarkOrderWithReturnedUseCase,
  ) {}

  @Put()
  @HttpCode(200)
  async handle(@Param("id") order_id: string, @CurrentUser() user: User) {
    await this.markOrderWithReturnedUseCase.execute({
      order_id,
      courier_id: user.id,
    });
  }
}
