import { Prisma, Recipient as PrismaRecipient } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Recipient } from "@/application/entities/recipient";

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        address: raw.address,
        number: raw.number,
        neighbourhood: raw.neighbourhood,
        city: raw.city,
        state: raw.state,
        zip_code: raw.zip_code,
        complement: raw.complement || null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      address: recipient.address,
      number: recipient.number,
      neighbourhood: recipient.neighbourhood,
      city: recipient.city,
      state: recipient.state,
      zip_code: recipient.zip_code,
      complement: recipient.complement,
    };
  }
}
