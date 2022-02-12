require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const winston = require('winston')
require('winston-mongodb')
const helmet = require('helmet')
const config = require('config')

const { connectionUrl } = require('./database')

winston.add(new winston.transports.File({filename: 'logfile.log' }))
winston.add(new winston.transports.Console())
winston.add(new winston.transports.MongoDB({ db: connectionUrl, level: 'error'}))

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined')
    process.exit(1)
}

// MONGO CONNECTION
const { connectToDB } = require('./database')
connectToDB()

// ROUTES
const movies = require('./routes/movies')
const genres = require('./routes/genres')
const rentals = require('./routes/rentals')
const customers = require('./routes/customers')
const users = require('./routes/users')
const auth = require('./routes/auth')

// MIDDLEWARE
const error = require('./middleware/error')
app.use(express.json())
app.use(helmet())

app.use('/api/movies', movies)
app.use('/api/genres', genres)
app.use('/api/rentals', rentals)
app.use('/api/customers', customers)
app.use('/api/users', users)
app.use('/api/login', auth)

app.use(error)

// LISTEN TO PORT
const port = process.env.PORT || process.env.DEV_PORT

app.listen(port, () => {
    console.log(`(NODE) Listening to port ${port}...`)
})