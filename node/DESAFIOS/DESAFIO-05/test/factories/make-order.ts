import { Order, OrderProps } from "@/application/entities/order";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PrismaOrderMapper } from "@/infra/database/prisma/mappers/prisma-order-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";

import { Injectable } from "@nestjs/common";

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      courier_id: new UniqueEntityID(),
      recipient_id: new UniqueEntityID(),
      status: "AWAITED",
      ...override,
    },
    id,
  );

  return order;
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data);

    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    });

    return order;
  }
}
