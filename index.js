require('dotenv').config()
const app = require('express')()
const helmet = require('helmet')
const mongoose = require('mongoose')
const Joi = require('joi')

// MONGO CONNECTION
async function connectToDB() {
    const mongoBaseUrl = (process.env.DEV_USING_DOCKER == "true")? process.env.DEV_MONGO_CONTAINER_URL : process.env.DEV_MONGO_LOCAL_URL 
    const databaseName = process.env.DATABASENAME
    const connectionUrl = `${mongoBaseUrl}/${databaseName}`

    console.log('(MONGOOSE) Using url:',connectionUrl)
    await mongoose.connect(mongoBaseUrl)
}

connectToDB().then(() => console.log('(MONGOOSE) Connected to MONGODB...'))
           .catch((e) => console.log('(MONGOOSE) Could not connect to database...', e))

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