import type { Org, Prisma } from "@prisma/client";

export abstract class OrgRepository {
  abstract create(data: Prisma.OrgCreateInput): Promise<Org>;
  abstract findByEmail(email: string): Promise<Org | null>;
}
