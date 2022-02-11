const mongoose = require('mongoose')
const Joi = require('joi')

const User = mongoose.model('User', {
    first_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    last_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 10,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
    },
})

const validateUser = (user) => {
    const userSchema = Joi.object({
        first_name: Joi.string().min(2).max(15).required(),
        last_name: Joi.string().min(2).max(15).required(),
        email: Joi.string().min(10).max(255).email().required(),
        password: Joi.string().min(6).max(1024).required()
    })

    return userSchema.validate(user)
}

module.exports = {
    User,
    validateUser,
}