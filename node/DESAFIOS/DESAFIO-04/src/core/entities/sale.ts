import type { Optional } from "../types/optional";
import { Entity } from "./entity";
import type { UniqueEntityID } from "./unique-entity-id";

interface SaleProps {
  product_id: string;
  amount: number;
  unit_price: number;
  created_at: Date;
}

export class Sale extends Entity<SaleProps> {
  get product_id() {
    return this.props.product_id;
  }

  get amount() {
    return this.props.amount;
  }

  get unit_price() {
    return this.props.unit_price;
  }

  get created_at() {
    return this.props.created_at;
  }

  static create(props: Optional<SaleProps, "created_at">, id?: UniqueEntityID) {
    const sale = new Sale(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    );

    return sale;
  }
}
