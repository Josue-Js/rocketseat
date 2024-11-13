import {
  FilterPetByCharacteristicParams,
  PetRepository,
} from "../pet-repository";
import { Pet, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { InMemoryOrgRepository } from "./in-memory-org-repository";

export class InMemoryPetRepository implements PetRepository {
  items: Pet[] = [];
  org: InMemoryOrgRepository;

  constructor() {
    this.org = new InMemoryOrgRepository();
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const requirements = (data.requirements as string[]) ?? [];

    const pet: Pet = {
      ...data,
      org_id: data.org_id,
      id: randomUUID() as string,
      requirements,
      about: data.about ?? null,
      created_at: new Date(),
    };
    this.items.push(pet);
    return pet;
  }

  async findByCity(city: string) {
    const orgs = this.org.items.filter((org) => org.city === city);

    const pets = this.items.filter((pet) =>
      orgs.some((org) => org.id === pet.org_id)
    );

    return pets;
  }

  async filterPetByCharacteristic(
    filter: FilterPetByCharacteristicParams
  ): Promise<Pet[]> {
    type Key = keyof typeof filter;

    const petsFiltered = this.items.filter((pet) => {
      const keys = Object.keys(filter).filter(
        (key) => filter[key as Key]
      ) as Array<Key>;

      const petIsValidate = keys.reduce((accumulator, key) => {
        if (pet[key] === filter[key]) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      if (keys.length === petIsValidate) {
        return pet;
      }
    });

    return petsFiltered;
  }

  async findById(id: string): Promise<Pet | null> {
    return this.items.find((pet) => pet.id === id) ?? null;
  }
}
