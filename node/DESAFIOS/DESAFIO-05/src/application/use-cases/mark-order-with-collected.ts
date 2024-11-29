import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Order } from "../entities/order";
import { OrderRepository } from "../repositories/order-repository";

interface MarkOrderWithCollectedUseCaseRequest {
  order_id: string;
  courier_id: string;
}

type MarkOrderWithCollectedUseCaseResponse = Order;

@Injectable()
export class MarkOrderWithCollectedUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    order_id,
    courier_id,
  }: MarkOrderWithCollectedUseCaseRequest): Promise<MarkOrderWithCollectedUseCaseResponse> {
    const order = await this.orderRepository.findById(order_id);

    if (!order) throw new BadRequestException("Order not exist");

    if (order.courier_id.toString() !== courier_id)
      throw new ForbiddenException();

    order.status = "COLLECTED";
    order.collected_at = new Date();

    this.orderRepository.update(order);

    return order;
  }
}
