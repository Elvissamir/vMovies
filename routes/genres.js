const express = require('express')
const auth = require("../middleware/auth")
const admin = require('../middleware/admin')
const router = express.Router()
const { Genre, validateGenre } = require('../models/Genre')

const genresErrors = {
    notFound: {status: 404, message:'The genre you are looking for does not exist.'}
}

router.get('/', async (req, res, next) => {
    throw new Error('Could not get genres')
    const genres = await Genre.find().sort('name')
    res.send(genres) 
})

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return sendErrorMessage(res, 'notFound')

    res.send(genre)
})

router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = new Genre({
        name: req.body.name
    })

    await genre.save()
    
    res.send(genre)
})

router.put('/:id', auth, async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return sendErrorMessage(res, 'notFound')

    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    genre.name = req.body.name
    await genre.save()

    res.send(genre)
})

router.delete('/:id', [ auth, admin ], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return sendErrorMessage(res, 'notFound')

    res.send(genre)
})

// FUNCTIONS
const sendErrorMessage = (res, errorName) => {
    const error = genresErrors[errorName]
    return res.status(error.status).send(error.message)
}

module.exports = router