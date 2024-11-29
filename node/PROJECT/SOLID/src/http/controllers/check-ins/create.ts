import { makeCheckInUseCase } from "@/use-cases/factories/make-checkIn-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckImBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckImBodySchema.parse(request.body);

  const createCheckInUseCase = makeCheckInUseCase();
  const checkIn = await createCheckInUseCase.execute({
    gymId,
    userId,
    UserLatitude: latitude,
    UserLongitude: longitude,
  });

  return reply.status(201).send({ checkIn });
}
