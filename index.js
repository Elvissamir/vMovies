require('dotenv').config()
const express = require('express')
const app = express()
const helmet = require('helmet')
const Joi = require('joi')

// MONGO CONNECTION
const { connectToDB } = require('./database')
connectToDB()

// MIDDLEWARE
app.use(express.json())
app.use(helmet())

// ROUTES
const genres = require('./routes/genres')

// GENRES
app.use('/api/genres', genres)

// LISTEN TO PORT
const port = process.env.PORT || process.env.DEV_PORT

app.listen(port, () => {
    console.log(`(NODE) Listening to port ${port}...`)
})