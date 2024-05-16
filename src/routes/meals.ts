/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (req, reply) => {
        console.log(`[${req.method}] ${req.url}`)
    })

    // list all meals
    app.get('/allMeals',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, reply) => {

            const meals = await knex('meals')
                .select('*')

            return meals
        })

    // list all from the same session 
    app.get('/',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, reply) => {
            const { sessionId } = req.cookies

            const meals = await knex('meals')
                .where({ session_id: sessionId })
                .select('*')

            return meals
        })

    // list one meal by id from the same session 

    app.get('/:id',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req) => {
            const getMealParamsSchema = z.object({
                id: z.string().uuid(),
            })

            const { id } = getMealParamsSchema.parse(req.params)

            const { sessionId } = req.cookies

            const meal = await knex('meals')
                .where({
                    session_id: sessionId,
                    id,
                })
                .first()

            return { meal }
        })


    //  create a meal and session if not provider
    app.post('/', async (req, reply) => {
        const createMealsBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            date: z.string(),
            diet: z.number(),

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

    // update one meal by id from the same session 

    app.put('/:id',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req) => {


            const getMealParamsSchema = z.object({

                name: z.string(),
                description: z.string(),
                date: z.string(),
                diet: z.number(),

            })

            const getIdParamsSchema = z.object({ id: z.string().uuid(), })
            const { name, description, date, diet } = getMealParamsSchema.parse(req.body)

            const { id } = getIdParamsSchema.parse(req.params)
            console.log(id);

            const { sessionId } = req.cookies

            const meal = await knex('meals')
                .where({
                    session_id: sessionId,
                    id,
                })
                .update({
                    name,
                    description,
                    date,
                    diet,
                })

            return { meal }
        })


    // delete one meal by id from the same session 

    app.delete('/:id',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, reply) => {
            const getMealParamsSchema = z.object({
                id: z.string().uuid(),
            })

            const { id } = getMealParamsSchema.parse(req.params)

            const { sessionId } = req.cookies

            await knex('meals')
                .where
                ({
                    session_id: sessionId,
                    id,
                })
                .del()

            return reply.status(201).send()
        })

    // metrics by session id
    app.get('/statistics',
        {
            preHandler: [checkSessionIdExists]
        },
        async (req, reply) => {
            const { sessionId } = req.cookies

            const meals = await knex('meals')
                .where({ session_id: sessionId })
                .select('*')

            let diet = 0
            let sequence = 0
            let bestSequence = 0
            let lastDiet = false

            meals.forEach(meal => {
                if (meal.diet === 1) {
                    diet = diet + 1
                    if (lastDiet === true) {
                        sequence = sequence + 1

                    }
                    lastDiet = true
                }
                if (meal.diet === 0) {
                    sequence = 0
                }
                if (sequence > bestSequence) {
                    bestSequence = sequence
                }

            })


            const stats = {
                total: meals.length,
                totalDiet: diet,
                totalNotDiet: meals.length - diet,
                bestSequence: bestSequence
            }

            return stats
        })


}
