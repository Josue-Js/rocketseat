import { Optional } from "@prisma/client/runtime/library";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface RecipientProps {
  name: string;
  address: string;
  number: number;
  neighbourhood: string;
  city: string;
  state: string;
  zip_code: string;
  complement: string | null;
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get city() {
    return this.props.city;
  }

  get neighbourhood() {
    return this.props.neighbourhood;
  }

  set neighbourhood(neighbourhood: string) {
    this.props.neighbourhood = neighbourhood;
  }

  set city(city: string) {
    this.props.city = city;
  }

  get state() {
    return this.props.state;
  }

  set state(state: string) {
    this.props.state = state;
  }

  get zip_code() {
    return this.props.zip_code;
  }

  set zip_code(zip_code: string) {
    this.props.zip_code = zip_code;
  }

  get address() {
    return this.props.address;
  }

  set address(address: string) {
    this.props.address = address;
  }

  get number() {
    return this.props.number;
  }

  set number(number: number) {
    this.props.number = number;
  }

  get complement() {
    return this.props.complement;
  }

  set complement(complement: string | null) {
    this.props.complement = complement;
  }

  static create(
    props: Optional<RecipientProps, "complement">,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        complement: props.complement ?? null,
      },
      id,
    );

    return recipient;
  }
}
