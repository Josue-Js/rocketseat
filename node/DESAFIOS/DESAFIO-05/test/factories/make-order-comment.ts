import {
  OrderAttachment,
  OrderAttachmentProps,
} from "@/application/entities/order-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeOrderAttachment(
  override: Partial<OrderAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const orderAttachment = OrderAttachment.create(
    {
      attachment_id: new UniqueEntityID(),
      order_id: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return orderAttachment;
}

@Injectable()
export class OrderAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<OrderAttachmentProps> = {},
  ): Promise<OrderAttachment> {
    const questionAttachment = makeOrderAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        order_id: questionAttachment.orderId.toString(),
      },
    });

    return questionAttachment;
  }
}
