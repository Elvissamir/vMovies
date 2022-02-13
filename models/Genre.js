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

// VALIDATION
const validateGenre = (data) => {
    const dataSchema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    })

    return dataSchema.validate(data)
}

module.exports = {
    Genre,
    validateGenre,
}