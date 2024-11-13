import { z } from "zod";

export const createMealDTO = z.object({
  name: z.string(),
  description: z.string(),
  isDiet: z.boolean(),
  date: z.string().pipe(z.coerce.date()),
});
