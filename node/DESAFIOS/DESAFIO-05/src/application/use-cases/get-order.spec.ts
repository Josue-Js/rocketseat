import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository";
import { GetOrderUseCase } from "./get-order";
import { makeOrder } from "test/factories/make-order";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { ForbiddenException } from "@nestjs/common";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: GetOrderUseCase;

describe("Get Order Use Case", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );

    sut = new GetOrderUseCase(inMemoryOrderRepository);
  });

  it("should be able to get a order", async () => {
    const order = makeOrder(
      { status: "AWAITED" },
      new UniqueEntityID("order-01"),
    );
    inMemoryOrderRepository.create(order);

    const result = await sut.execute({
      order_id: "order-01",
      role: "ADMIN",
    });

    expect(result).toMatchObject({
      id: order.id,
      status: "AWAITED",
    });
  });

  it("should not  be able to get a order if user not have role admin", async () => {
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
        }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
