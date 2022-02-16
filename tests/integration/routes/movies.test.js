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
        let token

        beforeEach(async () => {
            token = new User().generateAuthToken()
        })

        afterEach(async () => {
            await Movie.deleteMany()
            await Genre.deleteMany()
        })

        const sendPostRequest = (data) => {
            return request(app)
                        .post('/api/movies')
                        .set('x-auth-token', token)
                        .send(data)
        }

        it('Should create a new movie with the given data', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)

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

        it('Should return 400 if title is not provided', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)

            expect(res.status).toBe(400)
        })

        it('Should return 400 if title has less than 2 letters', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'a',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)

            expect(res.status).toBe(400)
        })

        it('Should return 400 if title has more than 255 letters', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: new Array(257).join('a'),
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)

            expect(res.status).toBe(400)
        })

        it('Should return 400 if title is not a string', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 1234,
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: [ genre._id ]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if genreIds is not provided', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if genreIds is not an array', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: "notAnArray"
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if genreIds does not have at least one item', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: []
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the provided genre ids are not valid', async () => {
            const data = {
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genreIds: ['1']
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if numberInStock is not provided', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()

            const data = {
                title: 'the movie',
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the numberInStock is less than 0', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: -1,
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the numberInStock is more than 255', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: 256,
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if the numberInStock is not a number', async () => {
            const genre = new Genre({ name: "genre" })
            await genre.save()
            
            const data = {
                title: 'the movie',
                numberInStock: 'notANumber',
                dailyRentalRate: 1,
                genreIds: [genre._id]
            }
            
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })
    })
})