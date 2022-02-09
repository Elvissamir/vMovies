const express = require('express')
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')
const genresErrors = {
    notFound: {status: 404, message:'The genre you are looking for does not exist.'}
}

// GENRES MODEL
const Genre = mongoose.model('Genre', {
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

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

    const genre = new Genre({
        name: req.body.name
    })

    genre.save()

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
const validateGenre = (genre) => {
    const genreSchema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    })

    return genreSchema.validate(genre)
}

const sendErrorMessage = (res, errorName) => {
    const error = genresErrors[errorName]
    return res.status(error.status).send(error.message)
}

module.exports = router