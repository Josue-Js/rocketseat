import { FastifyInstance } from "fastify";
import { createPet } from "./routes/create";
import { getPet } from "./routes/get-pet";
import { verifyJWT } from "@/middleware/verify-jwt";

export async function petRoutes(app: FastifyInstance) {
  app.post("/pet", createPet);
  app.get("/pet/:id", getPet);
}
