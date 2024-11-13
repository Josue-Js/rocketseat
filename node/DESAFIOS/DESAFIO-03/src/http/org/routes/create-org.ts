import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateOrgUseCase } from "@/use-cases/factories/make-create-org-use-case";

export async function createOrg(request: FastifyRequest, reply: FastifyReply) {
  const createOrgBodySchema = z.object({
    email: z.string(),
    name_of_person_responsible: z.string(),
    city: z.string(),
    state: z.string(),
    zip_code: z.string(),
    street: z.string(),
    phone: z.string(),
    password: z.string(),
  });

  const {
    city,
    email,
    name_of_person_responsible,
    password,
    phone,
    state,
    street,
    zip_code,
  } = createOrgBodySchema.parse(request.body);

  const createPetUseCase = makeCreateOrgUseCase();
  const { org } = await createPetUseCase.execute({
    city,
    email,
    name_of_person_responsible,
    password,
    phone,
    state,
    street,
    zip_code,
  });

  return reply.status(201).send({ org });
}
