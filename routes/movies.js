const router = require('express').Router()
const { Movie, validateMovie } = require('../models/Movie')

router.get('/', async (req, res) => {
    const movies = await Movie.find()

    res.send(movies)
})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('The movie does not exist')

    res.send(movie)
})

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let movie = new Movie({
        title: req.body.title,
        genres: req.body.genres,
        numberInStock: req.body.numberInStock
    })

    movie = await movie.save()
    res.send(movie)
})

router.put("/:id", async (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genres: req.body.genres
    })

    movie = await movie.save()
    res.send(movie)
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).send('The movie does not exist')

    res.send(movie)
})

module.exports = router