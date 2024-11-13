import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeLoginOrgUseCase } from "@/use-cases/factories/make-login-org-use-case";

export async function loginOrg(request: FastifyRequest, reply: FastifyReply) {
  const loginOrgBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = loginOrgBodySchema.parse(request.body);

  const createPetUseCase = makeLoginOrgUseCase();

  const { org } = await createPetUseCase.execute({
    email,
    password,
  });

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: org.id,
      },
    }
  );

  return reply.status(200).send({ token });
}
