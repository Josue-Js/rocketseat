import { PrismaPetRepository } from "@/repositories/prisma/prisma-pet-repository";
import { CreatePetUseCase } from "../pet/create-pet-use-case";

export function makeCreatePetUseCase() {
  const petRepository = new PrismaPetRepository();
  const useCase = new CreatePetUseCase(petRepository);

  return useCase;
}
