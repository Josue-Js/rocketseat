import { DeleteOrderUseCase } from "@/application/use-cases/delete-order";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { Controller, Delete, HttpCode, Param, Post } from "@nestjs/common";

@Controller("/order/:id")
export class DeleteOrderController {
  constructor(private deleteOrderUseCase: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") order_id: string, @CurrentUser() user: User) {
    await this.deleteOrderUseCase.execute({
      order_id,
      role: user.role,
    });
  }
}
