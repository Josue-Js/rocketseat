import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Order } from "../entities/order";
import { OrderRepository } from "../repositories/order-repository";
import { Role, Status } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditOrderUseCaseRequest {
  order_id: string;
  role: Role;
  status?: Status;
  recipient_id?: string;
  courier_id?: string;
  delivered_at?: Date | null;
  collected_at?: Date | null;
}

type EditOrderUseCaseResponse = Order;

@Injectable()
export class EditOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    order_id,
    courier_id,
    role,
    status,
    collected_at,
    delivered_at,
    recipient_id,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    if (role !== "ADMIN") throw new ForbiddenException();

    const order = await this.orderRepository.findById(order_id);

    if (!order) {
      throw new BadRequestException("Order not exist");
    }

    if (order.status !== "AWAITED") {
      throw new BadRequestException();
    }

    order.status = status ?? order.status;
    order.delivered_at = delivered_at ?? order.delivered_at;
    order.collected_at = collected_at ?? order.collected_at;
    order.courier_id = courier_id
      ? new UniqueEntityID(courier_id)
      : order.courier_id;
    order.recipient_id = recipient_id
      ? new UniqueEntityID(recipient_id)
      : order.recipient_id;

    await this.orderRepository.update(order);

    return order;
  }
}
