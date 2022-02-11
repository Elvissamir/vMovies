const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')

const Rental = mongoose.model('Rental', {
    customer: {
        type: mongoose.Schema({
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
            phone: {
                type: String,
                required: true,
                minlength: 11,
                maxlength: 11
            },
            isGold: {
                type: Boolean,
                required: true
            },
        }),
        required: true,
    },
    movie: {
        type: mongoose.Schema({
            title: { 
                type: String, 
                trim: true,
                required: true, 
                minlength: 2, 
                maxlength: 255 
            },
            dailyRentalRate: { 
                type: Number, 
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

const validateRental = (data) => {
    const dataSchema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    })

    return dataSchema.validate(data)
}

module.exports = {
    Rental,
    validateRental,
}