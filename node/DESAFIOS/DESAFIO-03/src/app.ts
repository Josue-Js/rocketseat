import "dotenv/config";
import { env } from "./env";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { petRoutes } from "./http/pet/pet-routes";
import { orgRoutes } from "./http/org/org-routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: "10m",
  },
});

app.register(petRoutes);
app.register(orgRoutes);
