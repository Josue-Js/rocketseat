import { z } from "zod";

export const signInDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
