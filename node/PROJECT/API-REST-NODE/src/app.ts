import fastify from 'fastify';
import { transactionRoutes } from './routes/transaction';
import cookies from '@fastify/cookie'

export const app = fastify({ logger: true})

app.register(cookies)
app.register(transactionRoutes, {
    prefix: 'transactions'
})

