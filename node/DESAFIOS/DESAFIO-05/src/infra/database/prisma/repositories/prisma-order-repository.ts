import { Order } from "@/application/entities/order";

import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { OrderRepository } from "@/application/repositories/order-repository";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { OrderWithRecipient } from "@/application/entities/value-object/order-with-recipient";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { PrismaOrderWithRecipientMapper } from "../mappers/prisma-order-with-recipient-mapper";
import { OrderAttachmentRepository } from "@/application/repositories/order-attachment-repository";

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(
    private prisma: PrismaService,
    private orderAttachmentRepository: OrderAttachmentRepository,
  ) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.create({ data });
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) return null;

    return PrismaOrderMapper.toDomain(order);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({ where: { id } });
  }

  async findManyByCourierId(
    courier_id: string,
    { page }: PaginationParams,
    neighbourhood?: string,
  ): Promise<OrderWithRecipient[]> {
    const orderWithRecipients = await this.prisma.order.findMany({
      where: {
        courier_id,
        AND: {
          recipient: {
            neighbourhood: { contains: neighbourhood },
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        recipient: true,
      },
    });

    return orderWithRecipients.map(PrismaOrderWithRecipientMapper.toDomain);
  }
  async update(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.update({
      data,
      where: {
        id: order.id.toString(),
      },
    });

    await this.orderAttachmentRepository.createMany(
      order.attachments.getNewItems(),
    );
    await this.orderAttachmentRepository.deleteMany(
      order.attachments.getRemovedItems(),
    );
  }
}
