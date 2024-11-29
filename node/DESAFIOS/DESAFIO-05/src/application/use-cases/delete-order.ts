import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { OrderRepository } from "../repositories/order-repository";
import { Role } from "@prisma/client";

interface DeleteOrderUseCaseRequest {
  role: Role;
  order_id: string;
}

@Injectable()
export class DeleteOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ order_id, role }: DeleteOrderUseCaseRequest): Promise<void> {
    if (role !== "ADMIN") throw new ForbiddenException();

    const order = await this.orderRepository.findById(order_id);

    if (!order) throw new BadRequestException("Order not exist");

    await this.orderRepository.delete(order_id);
  }
}
