import { InMemoryOrgRepository } from "@/repositories/in-memory/in-memory-org-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateOrgUseCase } from "./create-org-use-case";
import bcrypt from "bcryptjs";

let orgRepository: InMemoryOrgRepository;
let sut: CreateOrgUseCase;

describe("Create Org Use Case", () => {
  beforeEach(() => {
    orgRepository = new InMemoryOrgRepository();
    sut = new CreateOrgUseCase(orgRepository);
  });

  it("should able create new org", async () => {
    const { org } = await sut.execute({
      city: "são paulo",
      state: "são paulo",
      email: "org@example.com",
      name_of_person_responsible: "john Doe",
      zip_code: "08000-000",
      phone: "(00) 00000-0000",
      street: "street",
      password: "123456",
    });

    expect(org).toMatchObject({
      city: "são paulo",
      state: "são paulo",
      email: "org@example.com",
    });
  });
});
