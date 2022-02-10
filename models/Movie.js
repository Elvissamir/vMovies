const Joi = require("joi")
const mongoose = require("mongoose")
const { mongooseGenreSchema } = require('./Genre')

const Movie = mongoose.model('Movie', {
    title: { type: String, required: true, minlength: 2, maxlength: 255 },
    genres: {
        type: [mongooseGenreSchema],
        validate: v => Array.isArray(v) && v.length > 0
    },
    numberInStock: { type: Number, required: true },
    dailyRentalRate: { type: Number, default: 0 }
})

const validateMovie = (movie) => {
    const movieSchema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        genres: Joi.array().min(1).required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number()
    })

    return movieSchema.validate(movie)
}

module.exports = {
    Movie, 
    validateMovie,
}