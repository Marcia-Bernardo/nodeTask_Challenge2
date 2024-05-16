import { it, beforeAll, afterAll, describe, expect,beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import{knex} from '../src/database'

import { execSync } from 'node:child_process'

describe('Meals routes', () => {

    beforeAll(async () => {
        execSync('npx knex migrate:latest')      
        await app.ready()        
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(async()=>{
        await knex("meals").del()     
    })


    it('Should be able to create a new meal', async () => {
        await request(app.server)
            .post('/meals')
            .send({
                name: "New name",
                description: "Caldo verde",
                date: "12/05/2024",
                diet: true
            })
            .expect(201)
    })


      
    it('Should be able to list all meals', async () => {
        const createMealsResponse = await request(app.server)
            .post('/meals')
            .send({
                name: "New name",
                description: "Caldo verde",
                date: "12/05/2024",
                diet: true
            })

        const cookies = createMealsResponse.get('Set-Cookie')

        const listMealsResponse = await request(app.server)
            .get('/meals')
            .set('Cookie', cookies)
            .expect(200)

        expect(listMealsResponse.body).toEqual([
            expect.objectContaining({
                name: "New name",
                description: "Caldo verde",
                date: "12/05/2024",
                diet: 1
            })
        ])
    })

    it('Should be able to get a specific meal', async () => {
        const createMealsResponse = await request(app.server)
            .post('/meals')
            .send({
                name: "New name",
                description: "Caldo verde",
                date: "12/05/2024",
                diet: true
            })

        const cookies = createMealsResponse.get('Set-Cookie')

        const listMealsResponse = await request(app.server)
            .get('/meals')
            .set('Cookie', cookies)
            .expect(200)

        const mealsId = listMealsResponse.body[0].id

        

        const getMealsResponse = await request(app.server)
            .get(`/meals/${mealsId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(getMealsResponse.body.meal).toEqual(
            expect.objectContaining({
                name: "New name",
                description: "Caldo verde",
                date: "12/05/2024",
                diet: 1
            })
        )
    })


  

})