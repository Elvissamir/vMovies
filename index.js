require('dotenv').config()
require('express-async-errors')
const winston = require('winston')
const express = require('express')
const app = express()
const { connectToDB } = require('./startup/database')

require('./startup/logging')()
require('./startup/config')()
require('./startup/routes')(app)
connectToDB()

// LISTEN TO PORT
const port = process.env.PORT || process.env.DEV_PORT
app.listen(port, () => {
    winston.info(`(NODE) Listening to port ${port}...`)
})