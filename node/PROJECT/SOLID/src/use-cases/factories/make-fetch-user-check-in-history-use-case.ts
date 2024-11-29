import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-repository";
import { FetchMembersCheckInHistoryUseCase } from "../fetch-user-check-in-history";

export function makeFetchUserCheckInHistoryUseCase() {
  const checkInRepository = new PrismaCheckInRepository();
  const useCase = new FetchMembersCheckInHistoryUseCase(checkInRepository);

  return useCase;
}
