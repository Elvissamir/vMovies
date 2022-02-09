require('dotenv').config()
const app = require('express')()
const helmet = require('helmet')
const mongoose = require('mongoose')
const Joi = require('joi')

// MIDDLEWARE
app.use(helmet())

// ROUTES
app.get('/', (req, res) => {
    res.send('Hello World')
})

// LISTEN TO PORT
const port = process.env.PORT || process.env.DEV_PORT

app.listen(port, () => {
    console.log(`(NODE) Listening to port ${port}...`)
})