import type {
  Age,
  Energia,
  Environment,
  Independence,
  Pet,
  Prisma,
} from "@prisma/client";

export interface FilterPetByCharacteristicParams {
  age?: Age;
  energia?: Energia;
  environment?: Environment;
  level_of_independence?: Independence;
}

export abstract class PetRepository {
  abstract create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
  abstract findByCity(city: string): Promise<Pet[]>;
  abstract findById(id: string): Promise<Pet | null>;
  abstract filterPetByCharacteristic(
    filter: FilterPetByCharacteristicParams
  ): Promise<Pet[]>;
}
