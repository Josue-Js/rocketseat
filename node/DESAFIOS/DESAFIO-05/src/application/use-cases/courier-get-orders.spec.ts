import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeCourier } from "test/factories/make-courier";
import { makeOrder } from "test/factories/make-order";
import { InMemoryCourierRepository } from "test/repositories/in-memory-courier-repository";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository";
import { CourierGetOrdersUseCase } from "./courier-get-orders";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { makeRecipient } from "test/factories/make-recipient";

let inMemoryCourierRepository: InMemoryCourierRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: CourierGetOrdersUseCase;

describe("Get Courier Orders Use Case", () => {
  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository();
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );

    sut = new CourierGetOrdersUseCase(inMemoryOrderRepository);
  });

  it.skip("should be able to get all orders from a courier", async () => {
    const courier = makeCourier(
      {
        name: "John Doe",
      },
      new UniqueEntityID("courier-01"),
    );
    inMemoryCourierRepository.create(courier);

    const recipient = makeRecipient(
      {
        neighbourhood: "neighbourhood",
      },
      new UniqueEntityID("recipient-01"),
    );

    inMemoryRecipientRepository.create(recipient);

    const order1 = makeOrder({
      courier_id: new UniqueEntityID("courier-01"),
      recipient_id: recipient.id,
    });
    const order2 = makeOrder({
      courier_id: new UniqueEntityID("courier-01"),
      recipient_id: recipient.id,
    });
    const order3 = makeOrder({
      courier_id: new UniqueEntityID("another-courier"),
    });

    inMemoryOrderRepository.create(order1);
    inMemoryOrderRepository.create(order2);
    inMemoryOrderRepository.create(order3);

    const result = await sut.execute({
      courier_id: "courier-01",
      page: 1,
    });

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      expect.objectContaining({ courier_id: courier.id }),
      expect.objectContaining({ courier_id: courier.id }),
    ]);
  });

  it("should be able to filter orders by neighbourhood", async () => {
    const courier = makeCourier({}, new UniqueEntityID("courier-01"));
    inMemoryCourierRepository.create(courier);

    const recipient1 = makeRecipient(
      {
        neighbourhood: "neighbourhood",
      },
      new UniqueEntityID("recipient-01"),
    );
    const recipient2 = makeRecipient(
      {
        neighbourhood: "another",
      },
      new UniqueEntityID("recipient-02"),
    );

    inMemoryRecipientRepository.create(recipient1);
    inMemoryRecipientRepository.create(recipient2);

    const order1 = makeOrder({
      courier_id: new UniqueEntityID("courier-01"),
      recipient_id: recipient1.id,
    });
    const order2 = makeOrder({
      courier_id: new UniqueEntityID("courier-01"),
      recipient_id: recipient2.id,
    });

    inMemoryOrderRepository.create(order1);
    inMemoryOrderRepository.create(order2);

    const result = await sut.execute({
      courier_id: "courier-01",
      page: 1,
      neighbourhood: "neighbourhood",
    });

    expect(result).toHaveLength(1);
    expect(result[0].recipient_neighbourhood).toEqual("neighbourhood");
  });
});
