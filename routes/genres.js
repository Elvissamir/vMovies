const express = require('express')
const router = express.Router()
const { genres } = require('../tempdata')
const genresErrors = {
    notFound: {status: 404, message:'The genre you are looking for does not exist.'}
}

//  GET ALL
router.get('/', (req, res) => {
    res.send(genres)
})

// GET :id
router.get('/:id', (req, res) => {
    const genre = getGenreById(req.params.id)

    if (!genre)
        return sendErrorMessage(res, 'notFound')

    res.send(genre)
})

// POST
router.post('/', (req, res) => {
    
    const newGenre = {
        id: genres.length,
        name: req.body.name
    }
    
    genres.push(newGenre)
    
    res.send(newGenre)
})

// PUT
router.put('/:id', (req, res) => {
    const genre = getGenreById(req.params.id)

    if (!genre)
        return sendErrorMessage(res, 'notFound')

    genre.name = req.body.name
    res.send(genre)
})

// DELETE
router.delete('/:id', (req, res) => {
    const genre = getGenreById(req.params.id)
    
    if (!genre)
    return sendErrorMessage(res, 'notFound')
    
    const index = genres.indexOf(genre)
    genres.splice(index, 1)
    
    res.send(genre)
})

// FUNCTIONS
const getGenreById = (id) => {
    return genres.find((g) => g.id == id)
}

const sendErrorMessage = (res, errorName) => {
    const error = genresErrors[errorName]
    return res.status(error.status).send(error.message)
}

module.exports = router