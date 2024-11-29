import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";
import { FetchNearByUseCase } from "../fetch-nearby-gyms";

export function makeFetchNearbyGymUseCase() {
  const gymRepository = new PrismaGymRepository();
  const useCase = new FetchNearByUseCase(gymRepository);

  return useCase;
}
