import { FastifyInstance } from "fastify";
import { signUp } from "./cases/sign-up";
import { signIn } from "./cases/sign-in";

export async function authRoutes(app: FastifyInstance) {
  app.post("/signUp", signUp);
  app.post("/signIn", signIn);
}
