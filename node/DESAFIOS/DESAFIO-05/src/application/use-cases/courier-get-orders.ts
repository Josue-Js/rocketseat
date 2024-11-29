import { Injectable } from "@nestjs/common";
import { OrderWithRecipient } from "../entities/value-object/order-with-recipient";
import { OrderRepository } from "../repositories/order-repository";

interface CourierGetOrdersUseCaseRequest {
  courier_id: string;
  page: number;
  neighbourhood?: string;
}

type CourierGetOrdersUseCaseResponse = OrderWithRecipient[];

@Injectable()
export class CourierGetOrdersUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    courier_id,
    page,
    neighbourhood,
  }: CourierGetOrdersUseCaseRequest): Promise<CourierGetOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByCourierId(
      courier_id,
      {
        page,
      },
      neighbourhood,
    );

    return orders;
  }
}
