import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"



export function checkSessionIdExist(request: FastifyRequest, reply: FastifyReply, next: HookHandlerDoneFunction) {

  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized'
    })
  }

  next()

}