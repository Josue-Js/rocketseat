import { CourierGetOrdersUseCase } from "@/application/use-cases/courier-get-orders";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { User } from "@/infra/auth/jwt.strategy";
import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { OrderWithRecipientPresenter } from "../presenters/order-presenter";

@Controller("/courier/orders")
export class CourierGetOrdersController {
  constructor(private courierGetOrdersUseCase: CourierGetOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query("page") page: string,
    @Query("neighbourhood") neighbourhood: string,
    @CurrentUser() payload: User,
  ) {
    const { id } = payload;

    const orders_with_recipient = await this.courierGetOrdersUseCase.execute({
      courier_id: id,
      page: page ? Number(page) : 1,
      neighbourhood,
    });

    return orders_with_recipient.map(OrderWithRecipientPresenter.toHTTP);
  }
}
