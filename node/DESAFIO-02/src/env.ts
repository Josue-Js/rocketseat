import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string(),
  SECRET: z.string(),
  EXPIRE: z.string(),
});

export const env = envSchema.parse(process.env);
