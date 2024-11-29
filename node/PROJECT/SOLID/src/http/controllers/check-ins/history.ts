import { makeFetchUserCheckInHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-in-history-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInHistoryUseCase = makeFetchUserCheckInHistoryUseCase();
  const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
    page,
    userId,
  });

  return reply.status(200).send({ checkIns });
}
