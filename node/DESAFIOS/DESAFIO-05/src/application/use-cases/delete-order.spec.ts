import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository";
import { DeleteOrderUseCase } from "./delete-order";
import { makeOrder } from "test/factories/make-order";
import { makeCourier } from "test/factories/make-courier";
import { ForbiddenException } from "@nestjs/common";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: DeleteOrderUseCase;

describe("Delete Order", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );
    sut = new DeleteOrderUseCase(inMemoryOrderRepository);
  });

  it("should be able to delete a order", async () => {
    const courier = makeCourier({ role: "ADMIN" });
    const order = makeOrder({});
    inMemoryOrderRepository.create(order);

    await sut.execute({ order_id: order.id.toString(), role: courier.role });

    expect(inMemoryOrderRepository.orders).toHaveLength(0);
  });

  it("should not be able to delete a order if user not have role ADMIN ", async () => {
    const courier = makeCourier({ role: "COURIER" });
    const order = makeOrder({});
    inMemoryOrderRepository.create(order);

    await expect(
      async () =>
        await sut.execute({
          order_id: order.id.toString(),
          role: courier.role,
        }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
