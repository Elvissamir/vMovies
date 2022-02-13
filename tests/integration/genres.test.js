const { Genre } = require('../../models/Genre')
const { User } = require('../../models/User')
const request = require('supertest')
const app = require('../../app')
const { random } = require('lodash')
const mongoose = require('mongoose')

describe('Route /api/genres', () => {
    afterEach(async () => {
        await Genre.deleteMany()
    })

    describe('GET /', () => {
        it('Should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: "genreA" },
                { name: 'genreB' }
            ])

            const res = await request(app).get('/api/genres')
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'genreA')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genreB')).toBeTruthy()
            expect(res.statusCode).toBe(200)
        })
    })

    describe('GET /:id', () => {
        it('Should return the right genre if valid id is passed', async () => {
            const genreA = new Genre({ name: 'genreA' }) 
            const genreB = new Genre({ name: "genreB" })
            
            await genreA.save()
            await genreB.save()

            const res = await request(app).get(`/api/genres/${genreA._id}`)
            expect(res.body).toHaveProperty('name', genreA.name)
            expect(res.status).toBe(200)
        })

        it('Should return 404 if no genre with the given id exists', async () => {
            const res = await request(app).get(`/api/genres/${mongoose.Types.ObjectId()}`)
            expect(res.status).toBe(404)
        })

        it('Should return 404 status if the given id is invalid', async () => {
            const res = await request(app).get(`/api/genres/${random(100)}`)
            expect(res.status).toBe(404)
        })
    })

    describe('POST /', () => {
        let token
        let name

        const sendPostRequest = async () => {
            return await request(app)
                            .post('/api/genres/')
                            .set('x-auth-token', token)
                            .send({ name: name })
        }

        beforeEach(() => {
            token = new User().generateAuthToken()
            name = 'GenreA'
        })

        it('Should store the genre and return it', async () => {
            name = new Array(6).join('a')
            
            const res = await sendPostRequest() 
            
            const genre = await Genre.find({ name: name })
            expect(genre).not.toBeNull()
            
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', name)
        })

        it('Should return 401 if client is not logged in', async () => {
            token = ''
            const res = await sendPostRequest()
            expect(res.status).toBe(401)
        })

        it('Should return 400 status if the given name is less than 5 characters', async () => {
            name = '1234'
            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })

        it('Should return 400 status if the given name has more than 5 characters', async () => {
            name = new Array(52).join('a')
            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })

        it('Should return 400 status if the name is not provided', async () => {
            name = undefined
            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })
    })
})