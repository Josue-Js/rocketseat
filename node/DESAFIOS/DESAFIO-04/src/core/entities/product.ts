import type { Optional } from "../types/optional";
import { Entity } from "./entity";
import type { UniqueEntityID } from "./unique-entity-id";

interface ProductProps {
  name: string;
  size: string;
  color: string;
  stock_id: string;
  created_at: Date;
  updated_at: Date;
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name;
  }

  get size() {
    return this.props.size;
  }

  get color() {
    return this.props.color;
  }

  get stock_id() {
    return this.props.stock_id;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  static create(props: Optional<ProductProps, "created_at">, id?: UniqueEntityID) {
    const product = new Product(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    );

    return product;
  }
}
