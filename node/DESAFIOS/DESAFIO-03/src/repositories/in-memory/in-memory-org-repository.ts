import type { Org, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { OrgRepository } from "../org-repository.js";

export class InMemoryOrgRepository implements OrgRepository {
  items: Org[] = [];

  async create(data: Prisma.OrgCreateInput) {
    const org: Org = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.items.push(org);
    return org;
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = this.items.find((org) => org.email === email) ?? null;

    return org;
  }
}
