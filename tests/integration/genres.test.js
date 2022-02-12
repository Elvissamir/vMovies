const { Genre } = require('../../models/Genre')
const { User } = require('../../models/User')
const request = require('supertest')
const app = require('../../index')
const { random, set } = require('lodash')

describe('Route /api/genres', () => {
    afterEach(async () => {
        await Genre.deleteMany({})
    })

    describe('GET /', () => {
        it('Should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: "genre1" },
                { name: 'genre2' }
            ])

            const res = await request(app).get('/api/genres')
            expect(res.statusCode).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()
        })
    })

    describe('GET /:id', () => {
        it('Should return the right genre if valid id is passed', async () => {
            const genreA = new Genre({ name: 'genreA' }) 
            const genreB = new Genre({ name: "genreB" })
            
            await genreA.save()
            await genreB.save()

            const res = await request(app).get(`/api/genres/${genreA._id}`)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genreA.name)
        })

        it('Should return 404 status if the given id is invalid', async () => {
            const res = await request(app).get(`/api/genres/${random(100)}`)
            expect(res.status).toBe(404)
        })
    })

    describe('POST /', () => {
        it('Should return 401 if client is not logged in', async () => {
            const res = await request(app).post('/api/genres/').send({ name: 'genreA' })
            expect(res.status).toBe(401)
        })

        it('Should return 400 status if the given name is less than 5 characters', async () => {
            const token = new User().generateAuthToken()

            const data = { name: '1234' }
            const res = await request(app)
                                .post('/api/genres/')
                                .set('x-auth-token', token)
                                .send(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 status if the given name has more than 5 characters', async () => {
            const token = new User().generateAuthToken()

            const data = { name: new Array(52).join('a') }
            const res = await request(app)
                                .post('/api/genres/')
                                .set('x-auth-token', token)
                                .send(data)
            expect(res.status).toBe(400)
        })
    })
})