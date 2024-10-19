import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { updateMealDTO } from "../dtos/update-meal-dto";

interface Params {
  id: string;
}

export async function updateMeal(
  request: FastifyRequest,
  replay: FastifyReply
) {
  const { id: mealId } = request.params as Params;

  const body = request.body;
  const user = request.user;
  const updateMealBody = updateMealDTO.parse(body);

  const mealsExist = await prisma.meals.findUnique({
    where: { id: mealId, AND: { user_id: user.id } },
  });

  if (!mealsExist) return replay.status(400).send({ error: "meal not exist" });
  const meals = await prisma.meals.update({
    data: {
      ...updateMealBody,
      user_id: user.id,
    },
    where: {
      id: mealId,
      AND: {
        user_id: user.id,
      },
    },
  });

  return replay.status(200).send({ meals });
}
