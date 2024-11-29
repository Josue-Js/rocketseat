import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository";
import { GetOrderUseCase } from "./get-order";
import { makeOrder } from "test/factories/make-order";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { ForbiddenException } from "@nestjs/common";
import { EditOrderUseCase } from "./edit-order";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: EditOrderUseCase;

describe("Make Order With Collected Use Case", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );

    sut = new EditOrderUseCase(inMemoryOrderRepository);
  });

  it("should be able to mark a order with collected", async () => {
    const order = makeOrder(
      { status: "AWAITED" },
      new UniqueEntityID("order-01"),
    );
    inMemoryOrderRepository.create(order);

    const result = await sut.execute({
      order_id: "order-01",
      role: "ADMIN",
      status: "RETURNED",
      collected_at: null,
      delivered_at: null,
    });

    expect(result).toMatchObject({
      id: order.id,
      status: "RETURNED",
    });
  });

  it("should be able to mark a order with collected", async () => {
    const order = makeOrder(
      { status: "AWAITED" },
      new UniqueEntityID("order-01"),
    );
    inMemoryOrderRepository.create(order);

    await expect(
      async () =>
        await sut.execute({
          order_id: "order-01",
          role: "COURIER",
          status: "RETURNED",
          collected_at: null,
          delivered_at: null,
        }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
