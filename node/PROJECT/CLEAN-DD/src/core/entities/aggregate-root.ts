import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { Entity } from "./entity";

export abstract class AggregateRoot<props> extends Entity<props> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents() {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent) {
    this.domainEvents.push(domainEvent);

    DomainEvents.markAggregateForDispatch(this);
  }

  clearEvents() {
    this._domainEvents = [];
  }
}
