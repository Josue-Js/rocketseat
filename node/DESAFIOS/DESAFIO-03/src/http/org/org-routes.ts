import { FastifyInstance } from "fastify";
import { createOrg } from "./routes/create-org";
import { loginOrg } from "./routes/login-org";

export async function orgRoutes(app: FastifyInstance) {
  app.post("/organization", createOrg);
  app.post("/login", loginOrg);
}
