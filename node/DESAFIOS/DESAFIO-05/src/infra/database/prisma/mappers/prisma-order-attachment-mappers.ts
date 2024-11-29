import { OrderAttachment } from "@/application/entities/order-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { Prisma, Attachment as PrismaOrderAttachment } from "@prisma/client";

export class PrismaOrderAttachmentMapper {
  static toDomain(raw: PrismaOrderAttachment): OrderAttachment {
    if (!raw.order_id) {
      throw new Error("Invalid attachment type.");
    }

    return OrderAttachment.create(
      {
        attachment_id: new UniqueEntityID(raw.id),
        order_id: new UniqueEntityID(raw.order_id),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(
    attachments: OrderAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) =>
      attachment.attachment_id.toString(),
    );

    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        order_id: attachments[0].order_id.toString(),
      },
    };
  }
}
