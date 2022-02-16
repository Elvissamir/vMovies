const app = require('../../../app')
const request = require('supertest')
const mongoose = require('mongoose')
const { Movie } = require('../../../models/Movie')
const { Genre } = require('../../../models/Genre')
const { User } = require('../../../models/User')

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

    describe('POST /', () => {
        afterEach(async () => {
            await Movie.deleteMany()
            await Genre.deleteMany()
        })

        it('Should create a new movie with the given data', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const token = new User().generateAuthToken()
            const res = await request(app)
                                .post('/api/movies')
                                .set('x-auth-token', token)
                                .send(data)

            const movieInDb = await Movie.findOne({ title: 'the movie' })
            expect(movieInDb).toHaveProperty('title', data.title)
            expect(movieInDb).toHaveProperty('genres')
            expect(movieInDb).toHaveProperty('dailyRentalRate', data.dailyRentalRate)
            expect(movieInDb).toHaveProperty('numberInStock', data.numberInStock)
            
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('title', data.title)
            expect(res.body).toHaveProperty('genres')
            expect(res.body).toHaveProperty('dailyRentalRate', data.dailyRentalRate)
            expect(res.body).toHaveProperty('numberInStock', data.numberInStock)
        })
    })
})