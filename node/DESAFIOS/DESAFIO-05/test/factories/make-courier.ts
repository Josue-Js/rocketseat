import { Courier, CourierProps } from "@/application/entities/courier";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PrismaCourierMapper } from "@/infra/database/prisma/mappers/prisma-courier-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";

import { Injectable } from "@nestjs/common";

export function makeCourier(
  override: Partial<CourierProps> = {},
  id?: UniqueEntityID,
) {
  const courier = Courier.create(
    {
      name: faker.person.fullName(),
      cpf: faker.person.suffix(),
      password: faker.internet.password(),
      role: override.role ?? "COURIER",
      ...override,
    },
    id,
  );

  return courier;
}

@Injectable()
export class CourierFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourier(data: Partial<CourierProps> = {}): Promise<Courier> {
    const courier = makeCourier(data);

    await this.prisma.courier.create({
      data: PrismaCourierMapper.toPrisma(courier),
    });

    return courier;
  }
}
