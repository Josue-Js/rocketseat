import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../lib/prisma";
import { signInDTO } from "../dtos/sign-in-dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../../env";
export async function signIn(request: FastifyRequest, replay: FastifyReply) {
  const body = request.body;
  const { email, password } = signInDTO.parse(body);

  const userAlreadExist = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!userAlreadExist)
    return replay.status(401).send({ error: "email or password invalid" });

  const isPasswordValid = await bcrypt.compare(
    password,
    userAlreadExist?.password
  );

  if (!isPasswordValid)
    return replay.status(401).send({ error: "email or password invalid" });

  const token = jwt.sign({ id: userAlreadExist.id, email }, env.SECRET, {
    expiresIn: env.EXPIRE,
  });

  return replay.status(200).send({ token });
}
