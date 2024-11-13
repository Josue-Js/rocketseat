import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { createMealDTO } from "../dtos/create-meals-dto";

interface Params {
  id: string;
}

export async function getMeal(request: FastifyRequest, replay: FastifyReply) {
  const user = request.user;
  const { id: mealId } = request.params as Params;

  const meals = await prisma.meals.findUnique({
    where: { id: mealId, AND: { user_id: user.id } },
  });

  if (!meals) return replay.status(404).send({ error: "meal not exist" });

  return replay.status(200).send({ meals });
}
