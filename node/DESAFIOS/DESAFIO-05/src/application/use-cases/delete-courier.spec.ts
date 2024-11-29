import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeRecipient } from "test/factories/make-recipient";
import { InMemoryCourierRepository } from "test/repositories/in-memory-courier-repository";
import { DeleteCourierUseCase } from "./delete-courier";
import { makeCourier } from "test/factories/make-courier";
import { ForbiddenException } from "@nestjs/common";
import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";

let inMemoryCourierRepository: InMemoryCourierRepository;
let sut: DeleteCourierUseCase;

describe("Delete Courier", () => {
  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository();
    sut = new DeleteCourierUseCase(inMemoryCourierRepository);
  });

  it("should be able to delete a courier", async () => {
    const admin = makeCourier({ role: "ADMIN" });
    const courier = makeCourier({ role: "COURIER" });
    inMemoryCourierRepository.create(admin);
    inMemoryCourierRepository.create(courier);

    await sut.execute({
      role: admin.role,
      courier_id: courier.id.toString(),
    });

    expect(inMemoryCourierRepository.couriers).toHaveLength(1);
    expect(inMemoryCourierRepository.couriers[0]).toMatchObject({
      id: admin.id,
    });
  });

  it("should not be able to delete a courier if user not have role ADMIN ", async () => {
    const admin = makeCourier({ role: "COURIER" });
    const courier = makeCourier({ role: "COURIER" });

    inMemoryCourierRepository.create(admin);
    inMemoryCourierRepository.create(courier);

    await expect(
      async () =>
        await sut.execute({
          role: admin.role,
          courier_id: courier.id.toString(),
        }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
