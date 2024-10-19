import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";

export async function getMeals(request: FastifyRequest, replay: FastifyReply) {
  const user = request.user;
  const meals = await prisma.meals.findMany({ where: { user_id: user.id } });
  return replay.status(200).send({ meals });
}
