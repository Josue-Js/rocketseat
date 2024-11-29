import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { RegisterStudentUseCase } from "./register-student";

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: HashGenerator;

let sut: RegisterStudentUseCase;

describe("Register Student", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher);
  });

  it("should be able to register a student", async () => {
    const result = await sut.execute({
      name: "john doe",
      email: "john@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    });
  });

  it("should hash student password upon registration", async () => {
    const result = await sut.execute({
      name: "john doe",
      email: "john@example.com",
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentRepository.items[0].password).toEqual(hashedPassword);
  });
});
