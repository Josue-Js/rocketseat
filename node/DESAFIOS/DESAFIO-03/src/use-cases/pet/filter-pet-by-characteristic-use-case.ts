import { PetRepository } from "@/repositories/pet-repository";
import { Age, Energia, Environment, Independence, Size } from "@prisma/client";

interface FilterPetByCharacteristicRequest {
  age?: Age;
  energia?: Energia;
  environment?: Environment;
  size: Size;
  level_of_independence?: Independence;
}

export class FilterPetByCharacteristicUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    age,
    energia,
    environment,
    level_of_independence,
  }: FilterPetByCharacteristicRequest) {
    const pets = await this.petRepository.filterPetByCharacteristic({
      age,
      energia,
      environment,
      level_of_independence,
    });

    return { pets };
  }
}
