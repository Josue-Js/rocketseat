import fastify from "fastify";
import { authRoutes } from "./usecases/auth/auth-routes";
import { authMiddleware } from "./middleware/auth";
import { mealsRoutes } from "./usecases/meals/meals-routes";

export const app = fastify();

app.addHook("preHandler", authMiddleware);
app.register(authRoutes);
app.register(mealsRoutes, { prefix: "/meals" });
