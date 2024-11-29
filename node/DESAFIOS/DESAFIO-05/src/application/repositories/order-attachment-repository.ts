import { OrderAttachment } from "../entities/order-attachment";

export abstract class OrderAttachmentRepository {
  abstract createMany(attachment: OrderAttachment[]): Promise<void>;
  abstract deleteMany(attachment: OrderAttachment[]): Promise<void>;
  abstract findByManyByOrderId(orderId: string): Promise<OrderAttachment[]>;
  abstract deleteManyByOrderId(orderId: string): Promise<void>;
}
