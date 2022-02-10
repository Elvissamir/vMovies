require('dotenv').config()
const express = require('express')
const app = express()
const helmet = require('helmet')

// MONGO CONNECTION
const { connectToDB } = require('./database')
connectToDB()

// ROUTES
const movies = require('./routes/movies')
const customers = require('./routes/customers')
const genres = require('./routes/genres')
const rentals = require('./routes/rentals')

// MIDDLEWARE
app.use(express.json())
app.use(helmet())

// GENRES
app.use('/api/movies', movies)
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/rentals', rentals)

// LISTEN TO PORT
const port = process.env.PORT || process.env.DEV_PORT

app.listen(port, () => {
    console.log(`(NODE) Listening to port ${port}...`)
})