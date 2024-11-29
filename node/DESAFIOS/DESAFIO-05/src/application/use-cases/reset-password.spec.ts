import { InMemoryRecipientRepository } from "test/repositories/in-memory-recipient-repository";
import { GetRecipientUseCase } from "./get-recipient";
import { makeRecipient } from "test/factories/make-recipient";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResetPasswordUseCase } from "./reset-password";
import { InMemoryCourierRepository } from "test/repositories/in-memory-courier-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeCourier } from "test/factories/make-courier";

let inMemoryCourierRepository: InMemoryCourierRepository;
let fakeHasher: FakeHasher;
let sut: ResetPasswordUseCase;

describe("Reset Password Use Case", () => {
  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository();
    fakeHasher = new FakeHasher();

    sut = new ResetPasswordUseCase(inMemoryCourierRepository, fakeHasher);
  });

  it("should be able to reset password only user have role admin", async () => {
    const courier = makeCourier(
      {
        name: "John Doe",
        password: await fakeHasher.hash("000000"),
      },
      new UniqueEntityID("courier-01"),
    );

    inMemoryCourierRepository.create(courier);

    await sut.execute({
      courier_id: "courier-01",
      role: "ADMIN",
      new_password: "123456",
    });

    expect(inMemoryCourierRepository.couriers[0].password).toEqual(
      await fakeHasher.hash("123456"),
    );
  });
});
