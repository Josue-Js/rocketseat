import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetPetUseCase } from "@/use-cases/factories/make-get-pet-use-case";

export async function getPet(request: FastifyRequest, reply: FastifyReply) {
  const createPetParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = createPetParamsSchema.parse(request.params);

  const createPetUseCase = makeGetPetUseCase();
  const { pet } = await createPetUseCase.execute({ id });

  return reply.status(200).send({ pet });
}
