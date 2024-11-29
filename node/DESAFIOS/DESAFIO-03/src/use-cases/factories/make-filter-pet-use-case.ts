import { PrismaPetRepository } from "@/repositories/prisma/prisma-pet-repository";
import { CreatePetUseCase } from "../pet/create-pet-use-case";
import { FilterPetByCharacteristicUseCase } from "../pet/filter-pet-by-characteristic-use-case";

export function makeFilterPetUseCase() {
  const petRepository = new PrismaPetRepository();
  const useCase = new FilterPetByCharacteristicUseCase(petRepository);

  return useCase;
}
