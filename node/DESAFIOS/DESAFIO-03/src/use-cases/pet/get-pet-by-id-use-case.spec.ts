import { InMemoryPetRepository } from "@/repositories/in-memory/in-memory-pet-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetPetUseCase } from "./get-pet-by-id-use-case";

let petRepository: InMemoryPetRepository;
let sut: GetPetUseCase;

describe("Get Pet Use Case", () => {
  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    sut = new GetPetUseCase(petRepository);
  });

  it("should be able get pets by id", async () => {
    const createPetResponse = await petRepository.create({
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

    const { pet } = await sut.execute({ id: createPetResponse.id });

    expect(pet.id).toEqual(createPetResponse.id);
  });
});
