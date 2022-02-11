const router = require('express').Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { User, validateUser } = require('../models/User')

router.get('/', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    console.log(user)
    if (user) return res.status(400).send('User already registered.')

    user = new User(_.pick(req.body, ['first_name', 'last_name', 'email', "password"]))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'first_name', 'last_name', 'email']))
})

module.exports = router