import { GymRepository } from "@/repositories/gym-repository";
import { Gym } from "@prisma/client";

interface FetchNearByUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearByUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearByUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearByUseCaseRequest): Promise<FetchNearByUseCaseResponse> {
    const gyms = await this.gymRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
