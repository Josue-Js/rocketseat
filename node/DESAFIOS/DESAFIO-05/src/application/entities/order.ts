import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Status } from "@prisma/client";
import { Optional } from "src/core/types/optional";
import { OrderAttachmentList } from "./order-attachment-list";

export interface OrderProps {
  status: Status;
  posted_at: Date;
  courier_id: UniqueEntityID;
  recipient_id: UniqueEntityID;
  delivered_at: Date | null;
  collected_at: Date | null;
  attachments: OrderAttachmentList;
}

export class Order extends Entity<OrderProps> {
  get status() {
    return this.props.status;
  }

  get posted_at() {
    return this.props.posted_at;
  }

  get courier_id() {
    return this.props.courier_id;
  }

  set courier_id(courier_id: UniqueEntityID) {
    this.props.courier_id = courier_id;
  }

  get recipient_id() {
    return this.props.recipient_id;
  }

  set recipient_id(recipient_id: UniqueEntityID) {
    this.props.recipient_id = recipient_id;
  }

  get delivered_at() {
    return this.props.delivered_at;
  }

  get collected_at() {
    return this.props.collected_at;
  }

  set status(status: Status) {
    this.props.status = status;
  }

  set delivered_at(delivered_at: Date | null) {
    this.props.delivered_at = delivered_at;
  }

  set collected_at(collected_at: Date | null) {
    this.props.collected_at = collected_at;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: OrderAttachmentList) {
    this.props.attachments = attachments;
  }

  static create(
    props: Optional<
      OrderProps,
      "posted_at" | "collected_at" | "delivered_at" | "attachments"
    >,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        posted_at: props.posted_at ?? new Date(),
        delivered_at: props.delivered_at ?? null,
        collected_at: props.collected_at ?? null,
        attachments: props.attachments ?? new OrderAttachmentList(),
      },
      id,
    );

    return order;
  }
}
