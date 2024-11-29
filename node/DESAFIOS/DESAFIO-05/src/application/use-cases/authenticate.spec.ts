import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";

import { makeCourier } from "test/factories/make-courier";
import { InMemoryCourierRepository } from "test/repositories/in-memory-courier-repository";
import { AuthenticateUseCase } from "./authenticate";

let inMemoryCourierRepository: InMemoryCourierRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUseCase;

describe("Authenticate Courier Use Case", () => {
  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateUseCase(
      inMemoryCourierRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it("should be able to authenticate a student", async () => {
    const student = makeCourier({
      cpf: "12345678900",
      password: await fakeHasher.hash("123456"),
    });
    inMemoryCourierRepository.create(student);

    const result = await sut.execute({
      cpf: "12345678900",
      password: "123456",
    });

    expect(result).toEqual({
      access_token: expect.any(String),
    });
  });
});
