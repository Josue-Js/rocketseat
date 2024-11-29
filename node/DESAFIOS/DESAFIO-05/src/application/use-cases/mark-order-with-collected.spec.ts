import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeCourier } from "test/factories/make-courier";
import { makeOrder } from "test/factories/make-order";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { MarkOrderWithCollectedUseCase } from "./mark-order-with-collected";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: MarkOrderWithCollectedUseCase;

describe("Mark Order with collected Case", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );

    sut = new MarkOrderWithCollectedUseCase(inMemoryOrderRepository);
  });

  it("should be able to mark a order with collected", async () => {
    const courier = makeCourier({}, new UniqueEntityID("courier-01"));
    const order = makeOrder(
      { status: "AWAITED", courier_id: courier.id },
      new UniqueEntityID("order-01"),
    );
    inMemoryOrderRepository.create(order);

    await sut.execute({
      order_id: "order-01",
      courier_id: "courier-01",
    });

    expect(inMemoryOrderRepository.orders[0].status).toEqual("COLLECTED");
  });
});
