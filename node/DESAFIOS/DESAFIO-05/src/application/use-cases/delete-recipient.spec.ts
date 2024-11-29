import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { DeleteRecipientUseCase } from "./delete-recipient";
import { makeRecipient } from "test/factories/make-recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ForbiddenException } from "@nestjs/common";

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: DeleteRecipientUseCase;

describe("Delete Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new DeleteRecipientUseCase(inMemoryRecipientRepository);
  });

  it("should be able to delete a recipient", async () => {
    const recipient = makeRecipient({}, new UniqueEntityID("recipient-id"));
    inMemoryRecipientRepository.create(recipient);

    await sut.execute({ recipient_id: recipient.id.toString(), role: "ADMIN" });

    expect(inMemoryRecipientRepository.recipients).toHaveLength(0);
  });

  it("should not be able to delete a recipient if user not have role admin", async () => {
    const recipient = makeRecipient({}, new UniqueEntityID("recipient-id"));
    inMemoryRecipientRepository.create(recipient);

    await expect(
      async () =>
        await sut.execute({
          recipient_id: recipient.id.toString(),
          role: "COURIER",
        }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
