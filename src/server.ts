/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import { env } from './env'
import { mealsRoutes } from './routes/meals'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)

app.register(mealsRoutes, {
    prefix: 'meals'
})

app.listen({ port: env.PORT, }).then(() => {
    console.log('HTTP Server Running')
})
