import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Order } from "../entities/order";
import { OrderRepository } from "../repositories/order-repository";

interface MarkOderWithReturnedUseCaseRequest {
  order_id: string;
  courier_id: string;
}

type MarkOderWithReturnedUseCaseResponse = Order;

@Injectable()
export class MarkOrderWithReturnedUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    order_id,
    courier_id,
  }: MarkOderWithReturnedUseCaseRequest): Promise<MarkOderWithReturnedUseCaseResponse> {
    const order = await this.orderRepository.findById(order_id);

    if (!order) throw new BadRequestException("Order not exist");

    if (order.courier_id.toString() !== courier_id)
      throw new ForbiddenException();

    order.status = "RETURNED";

    this.orderRepository.update(order);

    return order;
  }
}
