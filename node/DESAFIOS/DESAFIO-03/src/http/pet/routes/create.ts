import { makeCreatePetUseCase } from "@/use-cases/factories/make-create-pet-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createPet(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    about: z.string().optional(),
    age: z.enum(["PUPPY", "YOUNG", "ADULT"]),
    size: z.enum(["SHORT", "MEDIUM_SIZED", "TALL"]),
    level_of_independence: z.enum(["LOW", "MEDIUM", "HIGH"]),
    energia: z.enum(["LAZY", "LOW", "MEDIUM", "VERY_HIGH"]),
    environment: z.enum(["LITTLE", "MEDIUM", "LARGE"]),
    requirements: z.array(z.string()),
    org_id: z.string(),
  });

  const {
    age,
    energia,
    environment,
    level_of_independence,
    name,
    org_id,
    requirements,
    size,
    about,
  } = createPetBodySchema.parse(request.body);

  const createPetUseCase = makeCreatePetUseCase();
  const { pet } = await createPetUseCase.execute({
    age,
    energia,
    environment,
    level_of_independence,
    name,
    org_id,
    requirements,
    size,
    about,
  });

  return reply.status(201).send({ pet });
}
