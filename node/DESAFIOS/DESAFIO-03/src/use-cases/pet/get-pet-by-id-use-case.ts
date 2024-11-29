import { PetRepository } from "@/repositories/pet-repository";

interface GetPetRequest {
  id: string;
}

export class GetPetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({ id }: GetPetRequest) {
    const pet = await this.petRepository.findById(id);

    if (!pet) throw new Error("Pet not found");

    return { pet };
  }
}
