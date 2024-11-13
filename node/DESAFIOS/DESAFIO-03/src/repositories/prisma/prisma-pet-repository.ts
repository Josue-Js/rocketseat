import { prisma } from "@/lib/prisma";
import { Pet, Prisma } from "@prisma/client";
import {
  FilterPetByCharacteristicParams,
  PetRepository,
} from "../pet-repository";

export class PrismaPetRepository implements PetRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    });
    return pet;
  }

  async findByCity(city: string) {
    const pets = await prisma.pet.findMany({
      where: {
        org: {
          city,
        },
      },
    });

    return pets;
  }

  async filterPetByCharacteristic({
    age,
    energia,
    environment,
    level_of_independence,
  }: FilterPetByCharacteristicParams) {
    const pets = await prisma.pet.findMany({
      where: {
        energia,
        age,
        environment,
        level_of_independence,
      },
    });

    return pets;
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = prisma.pet.findUnique({ where: { id } });
    return pet;
  }
}
