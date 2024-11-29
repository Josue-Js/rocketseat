import { UniqueEntityID } from "./unique-entity-id";

export abstract class ValueObject<T> {
  protected props: T;

  protected constructor(props: T, id?: UniqueEntityID) {
    this.props = props;
  }

  public equals(vo: ValueObject<unknown>) {
    if (!vo) return false;
    if (vo.props === undefined) return false;

    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}
