/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        const meals = await knex('meals')
            // .where('diet', true)
            .select('*')

        return meals
    })

    app.get('/:id', async (req) => {
        const getMealParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = getMealParamsSchema.parse(req.params)

        const meal = await knex('meals').where('id', id).first()
        return { meal }
    })

    app.get('/totalRecord', async () => {
        //    const summary = await knex ('meals').sum()
    }
    )

    app.post('/', async (req, reply) => {
        const createMealsBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            date: z.string(),
            diet: z.boolean(),

        })
        const { name, description, date, diet } = createMealsBodySchema.parse(req.body)


        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()
            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            })
        }


        await knex('meals')
            .insert({
                id: crypto.randomUUID(),
                name,
                description,
                date,
                diet,
                session_id: sessionId,
            })
        return reply.status(201).send()
    })
}
