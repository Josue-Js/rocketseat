import { InMemoryPetRepository } from "@/repositories/in-memory/in-memory-pet-repository";
import { PetRepository } from "@/repositories/pet-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreatePetUseCase } from "./create-pet-use-case";

let petRepository: InMemoryPetRepository;
let sut: CreatePetUseCase;

describe("Create Pet Use Case", () => {
  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    sut = new CreatePetUseCase(petRepository);
  });

  it("should able create new pet", async () => {
    const { pet } = await sut.execute({
      name: "BOB",
      about: "cutie dog",
      age: "PUPPY",
      energia: "LAZY",
      environment: "LITTLE",
      level_of_independence: "MEDIUM",
      org_id: "ORG-ID",
      size: "SHORT",
      requirements: [],
    });

    expect(pet).toMatchObject({ name: "BOB", about: "cutie dog" });
  });
});
