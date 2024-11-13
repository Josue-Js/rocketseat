import { PrismaOrgRepository } from "@/repositories/prisma/prisma-org-repository";
import { CreateOrgUseCase } from "../org/create-org-use-case";

export function makeCreateOrgUseCase() {
  const orgRepository = new PrismaOrgRepository();
  const useCase = new CreateOrgUseCase(orgRepository);

  return useCase;
}
