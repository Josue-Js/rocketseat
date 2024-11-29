import { config } from "dotenv";

import { PrismaClient } from "@prisma/client";

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { envSchema } from "src/infra/env/env";

config({ path: ".env", override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw Error("Please provider a DATABASE_URL environment variable.");
  }
  const url = new URL(env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseUrl(schemaId);

  process.env.DATABASE_URL = databaseURL;

  execSync("yarn prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
