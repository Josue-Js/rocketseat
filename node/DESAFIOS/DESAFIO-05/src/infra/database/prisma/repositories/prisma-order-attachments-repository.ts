import { Injectable } from "@nestjs/common";
import { PrismaOrderAttachmentMapper } from "../mappers/prisma-order-attachment-mappers";
import { PrismaService } from "../prisma.service";
import { OrderAttachment } from "@/application/entities/order-attachment";
import { OrderAttachmentRepository } from "@/application/repositories/order-attachment-repository";

@Injectable()
export class PrismaOrderAttachmentsRepository
  implements OrderAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findByManyByOrderId(order_id: string): Promise<OrderAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: { order_id: order_id },
    });

    return questionAttachments.map(PrismaOrderAttachmentMapper.toDomain);
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { order_id: orderId },
    });
  }

  async createMany(attachments: OrderAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    const data = PrismaOrderAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: OrderAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    const attachmentIds = attachments.map((attachment) =>
      attachment.id.toString(),
    );

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
  }
}
