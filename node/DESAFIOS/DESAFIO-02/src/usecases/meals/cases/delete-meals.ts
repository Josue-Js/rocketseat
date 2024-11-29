import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";

interface Params {
  id: string;
}

export async function deleteMeal(
  request: FastifyRequest,
  replay: FastifyReply
) {
  const user = request.user;
  const { id: mealId } = request.params as Params;

  if (!mealId) return replay.status(401).send({ error: "meals not exist" });

  const mealsExist = await prisma.meals.findUnique({
    where: { id: mealId, AND: { user_id: user.id } },
  });

  if (!mealsExist) return replay.status(401).send({ error: "meals not exist" });

  await prisma.meals.delete({ where: { id: mealId } });
  return replay.status(200).send();
}
