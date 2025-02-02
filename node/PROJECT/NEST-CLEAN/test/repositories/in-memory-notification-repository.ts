import { NotificationRepository } from "@/domain/notification/application/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = [];

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id) ?? null;
    return answer;
  }

  async update(notification: Notification) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id
    );
    this.items[itemIndex] = notification;
  }
}
