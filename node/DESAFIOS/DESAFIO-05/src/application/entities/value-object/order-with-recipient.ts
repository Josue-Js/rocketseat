import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { Status } from "@prisma/client";
import { ValueObject } from "./value-object";

export interface OrderWithRecipientProps {
  status: Status;
  posted_at: Date;
  courier_id: UniqueEntityID;
  delivered_at: Date | null;
  collected_at: Date | null;
  recipient: {
    id: UniqueEntityID;
    name: string;
    address: string;
    number: number;
    neighbourhood: string;
    city: string;
    state: string;
    zip_code: string;
    complement: string | null;
  };
}

export class OrderWithRecipient extends ValueObject<OrderWithRecipientProps> {
  get status() {
    return this.props.status;
  }

  get posted_at() {
    return this.props.posted_at;
  }

  get courier_id() {
    return this.props.courier_id;
  }

  get delivered_at() {
    return this.props.delivered_at;
  }

  get collected_at() {
    return this.props.collected_at;
  }

  get recipient_id() {
    return this.props.recipient.id;
  }

  get recipient_name() {
    return this.props.recipient.name;
  }
  get recipient_address() {
    return this.props.recipient.address;
  }

  get recipient_number() {
    return this.props.recipient.number;
  }
  get recipient_neighbourhood() {
    return this.props.recipient.neighbourhood;
  }

  get recipient_city() {
    return this.props.recipient.city;
  }

  get recipient_state() {
    return this.props.recipient.state;
  }

  get recipient_zip_code() {
    return this.props.recipient.zip_code;
  }

  get recipient_complement() {
    return this.props.recipient.complement;
  }

  static create(props: OrderWithRecipientProps) {
    return new OrderWithRecipient(props);
  }
}
