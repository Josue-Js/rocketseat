import { DeleteCourierUseCase } from "@/application/use-cases/delete-courier";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { Controller, Delete, HttpCode, Param } from "@nestjs/common";

@Controller("/courier/:id")
export class DeleteCourierController {
  constructor(private deleteCourierUseCase: DeleteCourierUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") courier_id: string, @CurrentUser() user: User) {
    await this.deleteCourierUseCase.execute({
      courier_id,
      role: user.role,
    });
  }
}
