import type { Optional } from "../types/optional";
import { Entity } from "./entity";
import type { UniqueEntityID } from "./unique-entity-id";

interface PurchaseOrderProps {
  amount: number;
  status: "completed" | "pending" | "canceled";
  created_at: Date;
}

export class PurchaseOrder extends Entity<PurchaseOrderProps> {
  get amount() {
    return this.props.amount;
  }

  get created_at() {
    return this.props.created_at;
  }

  static create(props: Optional<PurchaseOrderProps, "created_at">, id?: UniqueEntityID) {
    const purchaseOrder = new PurchaseOrder(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    );

    return purchaseOrder;
  }
}
