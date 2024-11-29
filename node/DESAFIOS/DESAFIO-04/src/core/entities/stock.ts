import type { Optional } from "../types/optional";
import { Entity } from "./entity";
import type { UniqueEntityID } from "./unique-entity-id";

interface StockProps {
  name: string;
  quantity: number;
  min_stock: number;
  created_at: Date;
  updated_at: Date | null;
}

export class Stock extends Entity<StockProps> {
  get name() {
    return this.props.name;
  }

  get quantity() {
    return this.props.quantity;
  }

  get min_stock() {
    return this.props.min_stock;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }
  set quantity(quantity: number) {
    this.props.quantity = quantity;
    this.touch();
  }

  set min_stock(min_stock: number) {
    this.props.min_stock = min_stock;
    this.touch();
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  static create(props: Optional<StockProps, "created_at">, id?: UniqueEntityID) {
    const stock = new Stock(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    );

    return stock;
  }
}
