import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { OrderRepository } from "../repositories/order-repository";
import { Role, Status } from "@prisma/client";

interface OrderStatusUseCaseRequest {
  role: Role;
  order_id: string;
  courier_id: string;
  status: Status;
}

@Injectable()
export class OrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    order_id,
    role,
    courier_id,
    status,
  }: OrderStatusUseCaseRequest): Promise<void> {
    if (role !== "ADMIN") throw new ForbiddenException();

    const order = await this.orderRepository.findById(order_id);

    if (!order) throw new BadRequestException("Order not exist");

    order.status = status;

    await this.orderRepository.update(order);
  }
}
