const auth = require("../middleware/auth")
const { Rental } = require("../models/Rental")

const router = require("express").Router()

router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('The customer id is required')
    if (!req.body.movieId) return res.status(400).send('The movie id is required')

    const rental = await Rental.find({ 
        customer: { _id: req.body.customerId },
        movie: { _id: req.body.movieId }
    })

    if (!rental) return res.status(404).send('The rental does not exist')
    
    res.status(200).send(rental)
})

module.exports = router