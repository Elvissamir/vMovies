const auth = require("../middleware/auth")
const validate = require('../middleware/validate')
const { Rental } = require("../models/Rental")
const { Movie } = require("../models/Movie")
const moment = require('moment')
const Joi = require('joi')
require('joi-objectid')

const router = require("express").Router()

const validateReturn = (data) => {
    const dataSchema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })

    return dataSchema.validate(data)
}

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId)

    if (!rental) return res.status(404).send('The rental does not exist')
    if (rental.dateReturned) return res.status(400).send("Already processed.")
    
    rental.dateReturned = new Date()

    const rentalDays = moment().diff(rental.dateOut, 'days')
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate
    await rental.save()

    await Movie.updateOne({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    })

    res.status(200).send(rental)
})

module.exports = router