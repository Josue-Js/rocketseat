import { GetCourierUseCase } from "@/application/use-cases/get-courier";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { Controller, Get, HttpCode } from "@nestjs/common";
import { CourierPresenter } from "../presenters/courier-presenter";
import { User } from "@/infra/auth/jwt.strategy";

@Controller("/profile")
export class GetCourierController {
  constructor(private getCourierUseCase: GetCourierUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: User) {
    const courier = await this.getCourierUseCase.execute({
      courier_id: user.id,
    });

    return CourierPresenter.toHTTP(courier);
  }
}
