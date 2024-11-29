import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { compare } from "bcrypt";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistError } from "./erros/user-already-exists";

let userRepository: InMemoryUserRepository;
let stu: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    stu = new RegisterUseCase(userRepository);
  });

  it("should be able to register", async () => {
    const { user } = await stu.execute({
      name: "John Doe",
      email: "john@gmail.com",
      password: "123456",
    });
    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await stu.execute({
      name: "John Doe",
      email: "john@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "john@gmail.com";

    await stu.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(
      async () =>
        await stu.execute({
          name: "John Doe",
          email,
          password: "123456",
        })
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
