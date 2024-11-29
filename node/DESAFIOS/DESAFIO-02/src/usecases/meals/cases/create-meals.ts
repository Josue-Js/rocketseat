import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { createMealDTO } from "../dtos/create-meals-dto";

export async function createMeal(
  request: FastifyRequest,
  replay: FastifyReply
) {
  const body = request.body;
  const user = request.user;
  const meal = createMealDTO.parse(body);

  const meals = await prisma.meals.create({
    data: {
      user_id: user.id,
      ...meal,
    },
  });
  return replay.status(201).send({ meals });
}
