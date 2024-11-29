import { Prisma, Courier as PrismaCourier } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Courier } from "@/application/entities/courier";

export class PrismaCourierMapper {
  static toDomain(raw: PrismaCourier): Courier {
    return Courier.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        role: raw.role,
        password: raw.password_hash,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(courier: Courier): Prisma.CourierUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      cpf: courier.cpf,
      role: courier.role,
      password_hash: courier.password,
    };
  }
}
