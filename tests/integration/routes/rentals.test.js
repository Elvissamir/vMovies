const app = require('../../../app')
const request = require('supertest')
const { Customer } = require('../../../models/Customer')
const { Movie } = require('../../../models/Movie')
const { Genre } = require('../../../models/Genre')
const { Rental } = require('../../../models/Rental')

describe('Route /api/rentals', () => {
    describe('GET /', () => {
        
        beforeEach(async () => {
            const customer = new Customer({
                first_name: 'fname',
                last_name: 'lname',
                phone: '02423454534',
                isGold: true
            })

            const movie = new Movie({
                title: 'the movie',
                numberInStock: 5,
                dailyRentalRate: 1,
                genres: [ new Genre({ name: 'genre'}) ]
            })

            const rental = new Rental({
                customer: {
                    id: customer._id,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    phone: customer.phone,
                    isGold: customer.isGold
                },
                movie: {
                    id: movie._id,
                    title: movie.title,
                    dailyRentalRate: movie.dailyRentalRate
                },
                dateOut: new Date
            })

            await customer.save()
            await movie.save()
            await rental.save()

            await Rental
        })

        afterEach(async () => {
            await Customer.deleteMany()
            await Movie.deleteMany()
            await Rental.deleteMany()
        })
        
        it('Should return all the rentals', async () => {
            const res = await request(app).get('/api/rentals')

            expect(res.status).toBe(200)
            expect(res.body[0]).toHaveProperty('customer')
            expect(res.body[0]).toHaveProperty('movie')
            expect(res.body[0]).toHaveProperty('dateOut')
        })
    })
})