import { DeleteRecipientUseCase } from "@/application/use-cases/delete-recipient";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { Controller, Delete, HttpCode, Param } from "@nestjs/common";

@Controller("/recipient/:id")
export class DeleteRecipientController {
  constructor(private deleteRecipientUseCase: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") recipient_id: string, @CurrentUser() user: User) {
    await this.deleteRecipientUseCase.execute({
      recipient_id,
      role: user.role,
    });
  }
}
