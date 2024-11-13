import "dotenv/config";
import { randomUUID } from "node:crypto";
import { Environment } from "vitest";
import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw Error("Please provide a DATABASE_URL environment variable");
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);

  return url.toString();
}

export default {
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    const schema = randomUUID();

    const databaseURL = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseURL;

    execSync("yarn prisma migrate deploy");

    return {
      teardown: async () => {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );

        await prisma.$disconnect();
      },
    };
  },
};
