import { LoginOrgUseCase } from "../org/login-org-use-case";
import { PrismaOrgRepository } from "@/repositories/prisma/prisma-org-repository";

export function makeLoginOrgUseCase() {
  const orgRepository = new PrismaOrgRepository();
  const useCase = new LoginOrgUseCase(orgRepository);

  return useCase;
}
