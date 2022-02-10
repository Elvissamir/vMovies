const Joi = require("joi")
const mongoose = require("mongoose")
const { mongooseGenreSchema } = require('./Genre')

const Movie = mongoose.model('Movie', {
    title: { 
        type: String, 
        trim: true,
        required: true, 
        minlength: 2, 
        maxlength: 255 
    },
    genres: {
        type: [mongooseGenreSchema],
        validate: v => Array.isArray(v) && v.length > 0
    },
    numberInStock: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
    }
})

const validateMovie = (movie) => {
    const movieSchema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        genreIds: Joi.array().items(Joi.string()).min(1).required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    })

    return movieSchema.validate(movie)
}

module.exports = {
    Movie, 
    validateMovie,
}