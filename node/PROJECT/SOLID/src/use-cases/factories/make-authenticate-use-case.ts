import { AuthenticateUseCase } from "../Authenticate";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUserRepository();
  const authenticateUseCase = new AuthenticateUseCase(userRepository);

  return authenticateUseCase;
}
