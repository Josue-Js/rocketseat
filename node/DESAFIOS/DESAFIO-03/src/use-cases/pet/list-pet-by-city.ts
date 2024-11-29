import { PetRepository } from "@/repositories/pet-repository";

interface ListPetByCityRequest {
  city: string;
}

export class ListPetByCityUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({ city }: ListPetByCityRequest) {
    const pets = await this.petRepository.findByCity(city);

    return pets;
  }
}
