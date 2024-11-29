import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics";
import { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  const getMetricsUseCase = makeGetUserMetricsUseCase();
  const { checkInsCount } = await getMetricsUseCase.execute({
    userId,
  });

  return reply.status(200).send({ checkInsCount });
}
