import { FastifyRequest, FastifyReply } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../env";

export interface IUser {
  id: string;
  email: string;
}
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const publicsRoutes = ["/signUp", "/signIn"];
  if (publicsRoutes.includes(request.url)) return;

  const authorization = request.headers.authorization;

  if (!authorization) return reply.status(401).send({ error: "miss token" });

  const [prefix, token] = authorization.split(" ");

  if (!prefix || !token)
    return reply.status(401).send({ error: "token invalid" });

  if (prefix !== "Bearer")
    return reply.status(401).send({ error: "token invalid" });

  return jwt.verify(token, env.SECRET, (error, decode) => {
    if (error) return reply.status(401).send({ error: "token invalid" });
    const user = (<any>decode) as IUser;
    request.user = user;
  });
}
