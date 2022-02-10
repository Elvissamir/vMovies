const express = require('express')
const router = express.Router()
const { Genre, validateGenre } = require('../models/Genre')

const genresErrors = {
    notFound: {status: 404, message:'The genre you are looking for does not exist.'}
}

//  GET ALL
router.get('/', async (req, res) => {
    const genres = await Genre.find()
    res.send(genres)
})

// GET ONE
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return sendErrorMessage(res, 'notFound')

    res.send(genre)
})

// POST
router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let genre = new Genre({
        name: req.body.name
    })

    genre = await genre.save()

    res.send(genre)
})

// PUT
router.put('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return sendErrorMessage(res, 'notFound')

    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    genre.name = req.body.name
    genre.save()

    res.send(genre)
})

// DELETE
router.delete('/:id', async (req, res) => {
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