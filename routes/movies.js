const router = require('express').Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { Movie, validateMovie } = require('../models/Movie')
const { Genre } = require('../models/Genre')
const validateObjectId = require('../middleware/validateObjectId')

router.get('/', async (req, res) => {
    const movies = await Movie.find()
    res.send(movies)
})

router.get('/:id', [ validateObjectId ], async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('The movie does not exist')

    res.send(movie)
})

router.post('/', auth, async (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genres = await Genre.find().where("_id").in(req.body.genreIds).exec()

    if (genres.length != req.body.genreIds.length) 
        return res.status(404).send('The genre does not exist')
    
    let movie = new Movie({  
        title: req.body.title,
        genres: genres,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await movie.save()
    res.send(movie)
})

router.put("/:id", auth, async (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genres: req.body.genres
    })

    await movie.save()
    res.send(movie)
})

router.delete('/:id', [ auth, admin ], async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).send('The movie does not exist')

    res.send(movie)
})

module.exports = router