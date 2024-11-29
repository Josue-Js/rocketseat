import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-repository";
import { CheckInValidateUseCase } from "../validate-check-in";

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInRepository();
  const useCase = new CheckInValidateUseCase(checkInRepository);

  return useCase;
}
