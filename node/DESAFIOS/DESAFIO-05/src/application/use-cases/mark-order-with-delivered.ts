import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Order } from "../entities/order";
import { OrderRepository } from "../repositories/order-repository";
import { OrderAttachment } from "../entities/order-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderAttachmentList } from "../entities/order-attachment-list";
import { OrderAttachmentRepository } from "../repositories/order-attachment-repository";

interface MarkOrderWithDeliveredUseCaseRequest {
  order_id: string;
  courier_id: string;
  attachments: string[];
}

type MarkOrderWithDeliveredUseCaseResponse = Order;

@Injectable()
export class MarkOrderWithDeliveredUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderAttachmentRepository: OrderAttachmentRepository,
  ) {}

  async execute({
    order_id,
    courier_id,
    attachments,
  }: MarkOrderWithDeliveredUseCaseRequest): Promise<MarkOrderWithDeliveredUseCaseResponse> {
    const order = await this.orderRepository.findById(order_id);

    if (!order) throw new BadRequestException("Order not exist");
    if (attachments.length === 0)
      throw new BadRequestException("Attachment is miss");

    if (order.courier_id.toString() !== courier_id)
      throw new ForbiddenException();

    const current_order_attachment =
      await this.orderAttachmentRepository.findByManyByOrderId(order_id);

    const order_attachment_list = new OrderAttachmentList(
      current_order_attachment,
    );

    const order_Attachments = attachments.map((attachmentId) =>
      OrderAttachment.create({
        attachment_id: new UniqueEntityID(attachmentId),
        order_id: order.id,
      }),
    );

    order_attachment_list.update(order_Attachments);

    order.status = "DELIVERED";
    order.delivered_at = new Date();
    order.attachments = order_attachment_list;

    await this.orderRepository.update(order);

    return order;
  }
}
