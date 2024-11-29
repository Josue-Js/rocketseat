import { prisma } from "@/lib/prisma";
import { PetRepository } from "@/repositories/pet-repository";
import { Age, Energia, Size, Independence, Environment } from "@prisma/client";

interface CreatePetRequest {
  name: string;
  about?: string;
  age: Age;
  size: Size;
  level_of_independence: Independence;
  energia: Energia;
  environment: Environment;
  requirements: string[];
  org_id: string;
}

export class CreatePetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    age,
    energia,
    environment,
    level_of_independence,
    name,
    org_id,
    requirements,
    size,
    about,
  }: CreatePetRequest) {
    const pet = await this.petRepository.create({
      org_id,
      name,
      age,
      energia,
      environment,
      level_of_independence,
      requirements,
      size,
      about,
    });

    return { pet };
  }
}
