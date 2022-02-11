const router = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { User } = require('../models/User')

router.post('/', async (req, res) => {
    const { error } = validateLogin(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password')

    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'))

    res.send(token)
})
 
const validateLogin = (data) => {
    const loginDataSchema = Joi.object({
        email: Joi.string().min(10).max(255).email().required(),
        password: Joi.string().min(6).max(1024).required()
    })

    return loginDataSchema.validate(data)
}

module.exports = router