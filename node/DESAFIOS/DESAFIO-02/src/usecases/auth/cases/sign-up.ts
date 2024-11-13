import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { signUpDTO } from "../dtos/sign-up-dto";
import { date } from "zod";
import bcrypt from "bcrypt";

export async function signUp(request: FastifyRequest, replay: FastifyReply) {
  const body = request.body;
  const { name, email, password } = signUpDTO.parse(body);

  const userAlReadExist = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userAlReadExist) {
    return replay.status(401).send({ error: "user already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return replay.status(201).send(user);
}
