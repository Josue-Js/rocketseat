import { InMemoryOrgRepository } from "@/repositories/in-memory/in-memory-org-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateOrgUseCase } from "./create-org-use-case";
import bcrypt from "bcryptjs";
import { LoginOrgUseCase } from "./login-org-use-case";

let orgRepository: InMemoryOrgRepository;
let sut: LoginOrgUseCase;

describe("Login Org Use Case", () => {
  beforeEach(() => {
    orgRepository = new InMemoryOrgRepository();
    sut = new LoginOrgUseCase(orgRepository);
  });

  it("should be able to login a org", async () => {
    orgRepository.create({
      city: "são paulo",
      state: "são paulo",
      email: "org@example.com",
      name_of_person_responsible: "john Doe",
      zip_code: "08000-000",
      phone: "(00) 00000-0000",
      street: "street",
      password_hash: await bcrypt.hash("123456", 6),
    });

    const { org } = await sut.execute({
      email: "org@example.com",
      password: "123456",
    });

    expect(org).toMatchObject({
      id: expect.any(String),
      email: "org@example.com",
    });
  });
});
