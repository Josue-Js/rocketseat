import { ForbiddenException, Injectable } from "@nestjs/common";
import { Order } from "../entities/order";
import { OrderRepository } from "../repositories/order-repository";
import { Role } from "@prisma/client";

interface GetOrderUseCaseRequest {
  order_id: string;
  role: Role;
}

type GetOrderUseCaseResponse = Order;

@Injectable()
export class GetOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    order_id,
    role,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    if (role !== "ADMIN") throw new ForbiddenException();

    const order = await this.orderRepository.findById(order_id);

    if (!order) {
      throw new Error("Order not exist");
    }

    return order;
  }
}
