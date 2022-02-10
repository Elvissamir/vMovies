const mongoose = require('mongoose')
const Joi = require('joi')

// GENRES MODEL
const Genre = mongoose.model('Genre', {
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

const validateGenre = (genre) => {
    const genreSchema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    })

    return genreSchema.validate(genre)
}

exports = {
    Genre,
    validateGenre,
}