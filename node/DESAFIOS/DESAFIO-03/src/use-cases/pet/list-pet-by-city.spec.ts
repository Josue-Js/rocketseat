import { InMemoryPetRepository } from "@/repositories/in-memory/in-memory-pet-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ListPetByCityUseCase } from "./list-pet-by-city";
import bcrypt from "bcryptjs";

let petRepository: InMemoryPetRepository;
let sut: ListPetByCityUseCase;

describe("List Pet By City", () => {
  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    sut = new ListPetByCityUseCase(petRepository);
  });

  it("should be able get pets by city", async () => {
    const org = await petRepository.org.create({
      city: "são paulo",
      state: "são paulo",
      email: "org@example.com",
      name_of_person_responsible: "john Doe",
      zip_code: "08000-000",
      phone: "(00) 00000-0000",
      street: "street",
      password_hash: bcrypt.hashSync("123456", 7),
    });

    petRepository.create({
      name: "BOB",
      about: "cutie dog",
      age: "PUPPY",
      energia: "LAZY",
      environment: "LITTLE",
      level_of_independence: "MEDIUM",
      org_id: org.id,
      size: "SHORT",
      requirements: [],
    });

    const pets = await sut.execute({
      city: "são paulo",
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]).toMatchObject({
      name: "BOB",
      about: "cutie dog",
      age: "PUPPY",
      energia: "LAZY",
      environment: "LITTLE",
      level_of_independence: "MEDIUM",
      org_id: org.id,
      size: "SHORT",
    });
  });
});
