import { OrderAttachment } from "@/application/entities/order-attachment";
import { OrderAttachmentRepository } from "@/application/repositories/order-attachment-repository";

export class InMemoryOrderAttachmentRepository
  implements OrderAttachmentRepository
{
  items: OrderAttachment[] = [];

  async findByManyByOrderId(orderId: string): Promise<OrderAttachment[]> {
    const orderAttachments = this.items.filter(
      (item) => item.order_id.toString() === orderId,
    );

    return orderAttachments;
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.order_id.toString() !== orderId,
    );
  }

  async createMany(attachments: OrderAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: OrderAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });
  }
}
