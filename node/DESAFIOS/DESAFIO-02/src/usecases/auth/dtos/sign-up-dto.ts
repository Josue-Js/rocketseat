import { z } from "zod";

export const signUpDTO = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});
