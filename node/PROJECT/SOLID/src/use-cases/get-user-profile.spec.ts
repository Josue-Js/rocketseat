import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";

let userRepository: InMemoryUserRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new GetUserProfileUseCase(userRepository);
  });

  it("should be able to get user profile", async () => {
    const createUser = await userRepository.create({
      name: "john Deo",
      email: "john@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const user = await userRepository.findById(createUser.id);

    expect(user?.id).toEqual(createUser.id);
  });

  it("should not be able to get user profile with wrong id", async () => {
    expect(
      async () => await sut.execute({ userId: "id not exits" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
