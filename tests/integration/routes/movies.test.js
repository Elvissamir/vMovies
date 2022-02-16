const app = require('../../../app')
const request = require('supertest')
const mongoose = require('mongoose')
const { Movie } = require('../../../models/Movie')
const { Genre } = require('../../../models/Genre')

describe('Route /api/movies', () => {
    describe('GET /', () => {

        afterEach(async () => {
            await Genre.deleteMany()
            await Movie.deleteMany()
        })

        const sendGetRequest = () => {
            return request(app).get('/api/movies')
        }

        it('Should return the list of movies', async () => {
            const genreA = new Genre({
                name: 'Genre A'
            })

            const movieA = new Movie({ 
                title: 'movie A', 
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [genreA]
            })

            const movieB = new Movie({ 
                title: 'movie B', 
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [genreA]
            })

            await genreA.save()
            await movieA.save()
            await movieB.save()

            const res = await sendGetRequest()

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body[0]).toHaveProperty('title', 'movie A')
            expect(res.body[1]).toHaveProperty('title', 'movie B')
        })
    })

    describe('GET /:id', () => {
        afterEach(async () => {
            await Genre.deleteMany()
            await Movie.deleteMany()
        })

        it('Should return the movie by given id', async () => {
            const genreA = new Genre({
                name: 'Genre A'
            })

            const movieA = new Movie({ 
                title: 'movie A', 
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [genreA]
            })

            await genreA.save()
            await movieA.save()

            const res = await request(app).get(`/api/movies/${movieA._id}`)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('title', 'movie A')
        })

        it('Should return 404 if invalid id is given', async () => {
            const res = await request(app).get('/api/movies/1')

            expect(res.status).toBe(404)
        })

        it('Should return 404 if the movie does not exist', async () => {
            const randomDocumentId = mongoose.Types.ObjectId()

            const res = await request(app).get(`/api/movies/${randomDocumentId}`)

            expect(res.status).toBe(404)
        })
    })
})