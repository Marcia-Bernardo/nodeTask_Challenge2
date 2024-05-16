import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(fastifyCookie)

app.register(mealsRoutes, {
    prefix: 'meals'
})