import { Recipient, RecipientProps } from "@/application/entities/recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PrismaRecipientMapper } from "@/infra/database/prisma/mappers/prisma-recipient-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";

import { Injectable } from "@nestjs/common";

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      city: faker.location.city(),
      neighbourhood: faker.location.city(),
      number: faker.number.int({
        min: 0,
        max: 100,
      }),
      address: faker.location.street(),
      zip_code: faker.location.zipCode(),
      state: faker.location.state(),
      complement: faker.location.state(),
      ...override,
    },
    id,
  );

  return recipient;
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(data);

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });

    return recipient;
  }
}
