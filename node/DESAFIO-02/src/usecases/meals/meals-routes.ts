import { FastifyInstance } from "fastify";
import { getMeals } from "./cases/get-meals";
import { createMeal } from "./cases/create-meals";
import { deleteMeal } from "./cases/delete-meals";
import { getMeal } from "./cases/get-meal";
import { updateMeal } from "./cases/update-meals";

export async function mealsRoutes(app: FastifyInstance) {
  app.post("/", createMeal);
  app.get("/", getMeals);
  app.get("/:id", getMeal);
  app.delete("/:id", deleteMeal);
  app.put("/:id", updateMeal);
}
