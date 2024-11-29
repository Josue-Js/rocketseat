import { describe, expect, it } from "vitest";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./Authenticate";
import { hash } from "bcrypt";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error";
import { beforeEach } from "vitest";

let userRepository: InMemoryUserRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new AuthenticateUseCase(userRepository);
  });

  it("should be able to authenticate", async () => {
    await userRepository.create({
      name: "john Doe",
      email: "john@gmail.com",
      password_hash: await hash("123456", 10),
    });

    const user = await sut.execute({
      email: "john@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    expect(
      async () =>
        await sut.execute({
          email: "john@gmail.com",
          password: "123456",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await userRepository.create({
      name: "john Doe",
      email: "john@gmail.com",
      password_hash: await hash("123456", 10),
    });

    expect(
      async () =>
        await sut.execute({
          email: "john@gmail.com",
          password: "password wrong",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
