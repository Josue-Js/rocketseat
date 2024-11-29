import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository";
import { CreateOrderUseCase } from "./create-order";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ForbiddenException } from "@nestjs/common";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: CreateOrderUseCase;

describe("Create Order", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );

    sut = new CreateOrderUseCase(inMemoryOrderRepository);
  });

  it("should be able to create a order", async () => {
    await sut.execute({
      recipient_id: "recipient-id",
      courier_id: "courier-id",
      role: "ADMIN",
    });

    expect(inMemoryOrderRepository.orders[0]).toMatchObject({
      recipient_id: new UniqueEntityID("recipient-id"),
      courier_id: new UniqueEntityID("courier-id"),
    });
  });

  it("should not be able to create a order if user not have role admin", async () => {
    await expect(
      async () =>
        await sut.execute({
          recipient_id: "recipient-id",
          courier_id: "courier-id",
          role: "COURIER",
        }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
