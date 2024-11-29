import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface OrderAttachmentProps {
  order_id: UniqueEntityID;
  attachment_id: UniqueEntityID;
}

export class OrderAttachment extends Entity<OrderAttachmentProps> {
  get order_id() {
    return this.props.order_id;
  }

  get attachment_id() {
    return this.props.attachment_id;
  }

  static create(props: OrderAttachmentProps, id?: UniqueEntityID) {
    const orderAttachment = new OrderAttachment(props, id);

    return orderAttachment;
  }
}
