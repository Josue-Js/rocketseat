import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from 'fastify'
import { randomUUID } from "crypto"
import { checkSessionIdExist } from "../middlewares/checkSessionIdExist"

export async function transactionRoutes(app: FastifyInstance) {

  app.get('/', { preHandler: [checkSessionIdExist] }, async (request, reply) => {
    const { sessionId } = request.cookies
    const transactions = await prisma.transactions.findMany({
      where: {
        sessionId: sessionId
      }
    })

    return reply.send({
      transactions,
    })
  })

  app.post('/', async (request, reply) => {

    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    })

    const { title, amount, type } = createTransactionsBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }

    const transaction = await prisma.transactions.create({
      data: {
        title,
        amount,
        type,
        sessionId
      }
    })

    return reply.status(201).send(transaction)
  })

  app.get('/:id', { preHandler: [checkSessionIdExist] }, async (request, reply) => {

    const { sessionId } = request.cookies
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)

    const transaction = await prisma.transactions.findUnique({
      where: { id, sessionId }
    })
    return {
      transaction
    }
  })

  app.get('/summary', { preHandler: [checkSessionIdExist] }, async (request, reply) => {
    const { sessionId } = request.cookies
    const summary = await prisma.transactions.aggregate({
      _sum: {
        amount: true
      },
      where: { sessionId }
    })

    return {
      summary: summary._sum
    }
  })
} 