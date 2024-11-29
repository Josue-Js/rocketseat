import { Optional } from "@/core/types/optional";
import { Role } from "@prisma/client";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface CourierProps {
  name: string;
  cpf: string;
  role: Role;
  password: string;
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name;
  }
  set name(name: string) {
    this.props.name = name;
  }

  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf;
  }

  get role() {
    return this.props.role;
  }

  set role(role: Role) {
    this.props.role = role;
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }

  static create(props: Optional<CourierProps, "role">, id?: UniqueEntityID) {
    const courier = new Courier(
      {
        ...props,
        role: props.role || "COURIER",
      },
      id,
    );

    return courier;
  }
}
