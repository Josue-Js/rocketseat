import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { CreateRecipientUseCase } from "./create-recipient";
import { ForbiddenException } from "@nestjs/common";

let inMemoryRecipientRepository: InMemoryRecipientRepository;

let sut: CreateRecipientUseCase;

describe("Create Recipient", () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new CreateRecipientUseCase(inMemoryRecipientRepository);
  });

  it("should be able to create a recipient", async () => {
    await sut.execute({
      name: "John Doe",
      address: "street",
      city: "new york",
      complement: "house",
      number: 10,
      zip_code: "ny-123",
      state: "new york",
      role: "ADMIN",
      neighbourhood: "neighbourhood",
    });

    expect(inMemoryRecipientRepository.recipients[0]).toMatchObject({
      name: "John Doe",
      address: "street",
    });
  });
  it("should not be able to create a recipient if user not have role admin", async () => {
    await expect(
      async () =>
        await sut.execute({
          name: "John Doe",
          address: "street",
          city: "new york",
          complement: "house",
          number: 10,
          zip_code: "ny-123",
          state: "new york",
          role: "COURIER",
          neighbourhood: "",
        }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
