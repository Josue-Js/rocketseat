import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPetRepository } from "@/repositories/in-memory/in-memory-pet-repository";
import { FilterPetByCharacteristicUseCase } from "./filter-pet-by-characteristic-use-case";

let petRepository: InMemoryPetRepository;
let sut: FilterPetByCharacteristicUseCase;

describe("Filter Pet By Characteristic", () => {
  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    sut = new FilterPetByCharacteristicUseCase(petRepository);
  });

  it("should be able get pets by city", async () => {
    petRepository.create({
      name: "WILL",
      about: "cutie dog",
      age: "PUPPY",
      energia: "LAZY",
      environment: "LITTLE",
      level_of_independence: "MEDIUM",
      org_id: "01",
      size: "SHORT",
      requirements: [],
    });

    petRepository.create({
      name: "BOB",
      about: "cutie dog",
      age: "ADULT",
      energia: "MEDIUM",
      environment: "LITTLE",
      level_of_independence: "HIGH",
      org_id: "01",
      size: "TALL",
      requirements: [],
    });

    const { pets } = await sut.execute({
      age: "ADULT",
      energia: "MEDIUM",
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]).toMatchObject({
      name: "BOB",
      about: "cutie dog",
    });
  });
});
