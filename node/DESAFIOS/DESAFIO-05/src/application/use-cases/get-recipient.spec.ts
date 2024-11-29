import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { GetRecipientUseCase } from "./get-recipient";
import { makeRecipient } from "test/factories/make-recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: GetRecipientUseCase;

describe("Get Recipient Use Case", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new GetRecipientUseCase(inMemoryRecipientRepository);
  });

  it("should be able to get a recipient", async () => {
    const recipient = makeRecipient(
      {
        name: "John Doe",
      },
      new UniqueEntityID("recipient-01"),
    );
    inMemoryRecipientRepository.create(recipient);

    const result = await sut.execute({
      recipient_id: "recipient-01",
    });

    expect(result).toMatchObject({
      id: recipient.id,
      name: "John Doe",
    });
  });
});
