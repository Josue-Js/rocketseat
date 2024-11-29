import { z } from "zod";

export const updateMealDTO = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isDiet: z.boolean().optional(),
  date: z.date().optional(),
});
