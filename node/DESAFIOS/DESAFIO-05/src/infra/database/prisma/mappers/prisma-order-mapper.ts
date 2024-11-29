import { Prisma, Order as PrismaOrder } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order } from "@/application/entities/order";

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        courier_id: new UniqueEntityID(raw.courier_id),
        recipient_id: new UniqueEntityID(raw.recipient_id),
        status: raw.status,
        collected_at: raw.collected_at,
        delivered_at: raw.delivered_at,
        posted_at: raw.posted_at,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      courier_id: order.courier_id.toString(),
      recipient_id: order.recipient_id.toString(),
      status: order.status,
      collected_at: order.collected_at,
      delivered_at: order.delivered_at,
      posted_at: order.posted_at,
    };
  }
}
