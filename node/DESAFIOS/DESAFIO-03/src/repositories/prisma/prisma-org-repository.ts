import { prisma } from "@/lib/prisma";
import type { Org, Prisma } from "@prisma/client";
import { OrgRepository } from "../org-repository";

export class PrismaOrgRepository implements OrgRepository {
  async create(data: Prisma.OrgCreateInput): Promise<Org> {
    const org = await prisma.org.create({ data });

    return org;
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({ where: { email } });

    return org;
  }
}
