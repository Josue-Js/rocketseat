import { InMemoryCourierRepository } from "test/repositories/in-memory-courier-repository";
import { CreateAccountUseCase } from "./create-account";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryCourierRepository: InMemoryCourierRepository;
let fakeHasher: FakeHasher;
let sut: CreateAccountUseCase;

describe("Create Courier", () => {
  beforeEach(() => {
    inMemoryCourierRepository = new InMemoryCourierRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateAccountUseCase(inMemoryCourierRepository, fakeHasher);
  });

  it("should be able to register a student", async () => {
    await sut.execute({
      name: "John Doe",
      cpf: "000.000.000-02",
      password: "123456",
    });

    expect(inMemoryCourierRepository.couriers[0]).toMatchObject({
      name: "John Doe",
      cpf: "000.000.000-02",
    });
  });

  it("should hash student password upon registration", async () => {
    await sut.execute({
      name: "john doe",
      cpf: "000.000.000-02",
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(inMemoryCourierRepository.couriers[0].password).toEqual(
      hashedPassword,
    );
  });
});
