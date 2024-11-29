import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeOrder } from "test/factories/make-order";
import { InMemoryOrderRepository } from "test/repositories/in-memory-order-repository";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { MarkOrderWithDeliveredUseCase } from "./mark-order-with-delivered";
import { makeCourier } from "test/factories/make-courier";
import { InMemoryOrderAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository;

let sut: MarkOrderWithDeliveredUseCase;

describe("Make Order With Delivered Use Case", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository();

    sut = new MarkOrderWithDeliveredUseCase(
      inMemoryOrderRepository,
      inMemoryOrderAttachmentRepository,
    );
  });

  it("should be able to mark a order with delivered", async () => {
    const courier = makeCourier({}, new UniqueEntityID("courier-01"));
    const order = makeOrder(
      { status: "AWAITED", courier_id: courier.id },
      new UniqueEntityID("order-01"),
    );
    inMemoryOrderRepository.create(order);

    await sut.execute({
      order_id: "order-01",
      courier_id: "courier-01",
      attachments: ["attachment-01"],
    });

    expect(inMemoryOrderRepository.orders[0].status).toEqual("DELIVERED");
  });
});
