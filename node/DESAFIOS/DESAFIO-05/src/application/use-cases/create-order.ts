import { ForbiddenException, Injectable } from "@nestjs/common";
import { Order } from "../entities/order";
import { OrderRepository } from "../repositories/order-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Role } from "@prisma/client";
import { ro } from "@faker-js/faker/.";

interface CreateOrderUseCaseRequest {
  recipient_id: string;
  courier_id: string;
  role: Role;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    recipient_id,
    courier_id,
    role,
  }: CreateOrderUseCaseRequest): Promise<void> {
    if (role !== "ADMIN") throw new ForbiddenException();

    const order = Order.create({
      status: "AWAITED",
      recipient_id: new UniqueEntityID(recipient_id),
      courier_id: new UniqueEntityID(courier_id),

    });

    await this.orderRepository.create(order);
  }
}
