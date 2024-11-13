import { GetPetUseCase } from "../pet/get-pet-by-id-use-case";
import { PrismaPetRepository } from "@/repositories/prisma/prisma-pet-repository";

export function makeGetPetUseCase() {
  const petRepository = new PrismaPetRepository();
  const useCase = new GetPetUseCase(petRepository);

  return useCase;
}
