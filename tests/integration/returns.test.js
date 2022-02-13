const app = require('../../app')
const request = require('supertest')
const { User } = require('../../models/User')
const { Rental } = require('../../models/Rental')
const mongoose = require('mongoose')

describe('POST /api/returns', () => {
    let token
    let customerId
    let movieId
    let rental
    let data

    beforeEach(async () => {
        token = new User().generateAuthToken()
        customerId = mongoose.Types.ObjectId()
        movieId = mongoose.Types.ObjectId()
        data = { customerId, movieId }

        rental = new Rental({
            customer: { 
                _id: customerId,
                first_name: 'fname', 
                last_name: 'lname', 
                isGold: true,
                phone: '04242402945'
            },
            movie: {
                _id: movieId,
                title: 'title',
                dailyRentalRate: 2,
                numberInStock: 100,
                genres: [{ name: 'Genre', _id: mongoose.Types.ObjectId()}]
            }
        })

        await rental.save()
    })

    afterEach(async () => {
        await Rental.deleteMany()
    })

    const sendPostRequest = () => {
        return request(app)
                        .post('/api/returns')
                        .set('x-auth-token', token)
                        .send(data)
    }

    it('Should return 200 if valid request', async () => {
        const res = await sendPostRequest()
        expect(res.status).toBe(200)
    })

    it('Should return 401 if client is not logged in', async () => {
        token = ''

        const res = await sendPostRequest()
        expect(res.status).toBe(401)
    })

    it('Should return 400 if customer id is not provided', async () => {
        data.customerId = undefined

        const res = await sendPostRequest()
        expect(res.status).toBe(400)
    })

    it('Should return 400 if movie id is not provided', async () => {
        data.movieId = undefined

        const res = await sendPostRequest()
        expect(res.status).toBe(400)
    })

    it('Should return 400 if no rental found for this customer/movie', async () => {
        data.customerId = mongoose.Types.ObjectId(), 
        data.movieId = mongoose.Types.ObjectId() 

        const res = await sendPostRequest()
        expect(res.status).toBe(404)
    })
})