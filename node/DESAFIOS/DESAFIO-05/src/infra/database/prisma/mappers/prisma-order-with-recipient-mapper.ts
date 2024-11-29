import {
  Prisma,
  Order as PrismaOrder,
  Recipient as PrismaRecipient,
} from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderWithRecipient } from "@/application/entities/value-object/order-with-recipient";

type PrismaOrderWithRecipient = PrismaOrder & { recipient: PrismaRecipient };

export class PrismaOrderWithRecipientMapper {
  static toDomain(raw: PrismaOrderWithRecipient): OrderWithRecipient {
    return OrderWithRecipient.create({
      courier_id: new UniqueEntityID(raw.courier_id),
      status: raw.status,
      collected_at: raw.collected_at,
      delivered_at: raw.delivered_at,
      posted_at: raw.posted_at,
      recipient: {
        id: new UniqueEntityID(raw.recipient.id),
        name: raw.recipient.name,
        address: raw.recipient.address,
        number: raw.recipient.number,
        city: raw.recipient.city,
        state: raw.recipient.state,
        complement: raw.recipient.complement,
        zip_code: raw.recipient.zip_code,
        neighbourhood: raw.recipient.neighbourhood,
      },
    });
  }
}
