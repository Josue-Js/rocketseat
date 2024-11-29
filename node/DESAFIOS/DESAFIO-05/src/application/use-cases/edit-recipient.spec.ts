import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { makeRecipient } from "test/factories/make-recipient";
import { EditRecipientUseCase } from "./edit-recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ForbiddenException } from "@nestjs/common";

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: EditRecipientUseCase;

describe("Edit Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new EditRecipientUseCase(inMemoryRecipientRepository);
  });

  it("should be able to update a recipient", async () => {
    const recipient = makeRecipient(
      {
        name: "John Doe",
        address: "street",
        city: "new york",
        complement: "house",
        number: 10,
        zip_code: "ny-123",
        state: "new york",
      },
      new UniqueEntityID("recipient-id"),
    );
    inMemoryRecipientRepository.create(recipient);

    await sut.execute({
      recipient_id: "recipient-id",
      name: "update name",
      address: "update address",
      city: "update city",
      state: "update state",
      number: 0,
      zip_code: "update zid_code",
      complement: "update complement",
      role: "ADMIN",
    });

    expect(inMemoryRecipientRepository.recipients[0]).toMatchObject({
      name: "update name",
      address: "update address",
      city: "update city",
      state: "update state",
      number: 0,
      zip_code: "update zid_code",
      complement: "update complement",
    });
  });
  it("should not be able to update a recipient if user not have role admin", async () => {
    const recipient = makeRecipient(
      {
        name: "John Doe",
        address: "street",
        city: "new york",
        complement: "house",
        number: 10,
        zip_code: "ny-123",
        state: "new york",
      },
      new UniqueEntityID("recipient-id"),
    );
    inMemoryRecipientRepository.create(recipient);

    await expect(
      async () =>
        await sut.execute({
          recipient_id: "recipient-id",
          name: "update name",
          address: "update address",
          city: "update city",
          state: "update state",
          number: 0,
          zip_code: "update zid_code",
          complement: "update complement",
          role: "COURIER",
        }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
