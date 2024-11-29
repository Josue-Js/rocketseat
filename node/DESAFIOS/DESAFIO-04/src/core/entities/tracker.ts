import type { Optional } from "../types/optional";
import { Entity } from "./entity";
import type { UniqueEntityID } from "./unique-entity-id";

interface TrackProps {
  product_id: string;
  type: "ENTRY" | "OUT";
  amount: number;
  created_at: Date;
}

export class Track extends Entity<TrackProps> {
  get product_id() {
    return this.props.product_id;
  }

  get type() {
    return this.props.type;
  }

  get amount() {
    return this.props.amount;
  }

  static create(props: Optional<TrackProps, "created_at">, id?: UniqueEntityID) {
    const track = new Track(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id,
    );

    return track;
  }
}
