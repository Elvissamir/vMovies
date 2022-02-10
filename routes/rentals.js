const router = require('express').Router()
const { Rental, validateRental } = require('../models/Rental')
const { Customer } = require('../models/Customer')
const { Movie } = require('../models/Movie')

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    res.send(rentals)
})

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(404).send('The customer does not exist')

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(404).send('The movie does not exist')

    if (movie.numberInStock === 0) return res.status(400).send('Movie not available...')

    let rental = new Rental({
        customer: { 
            _id: customer._id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    rental = await rental.save()
    
    movie.numberInStock--
    movie.save()

    res.send(rental)
})

module.exports = router