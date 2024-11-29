import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Prisma, Notification as PrismaNotification } from "@prisma/client";

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityID(raw.recipient_id),
        title: raw.title,
        content: raw.content,
        readAt: raw.read_at,
        createdAt: raw.created_at,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      recipient_id: notification.recipientId.toString(),
      created_at: notification.createdAt,
      read_at: notification.readAt,
    };
  }
}
