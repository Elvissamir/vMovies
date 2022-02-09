const mongoose = require('mongoose')

async function connect() {
    const mongoBaseUrl = (process.env.DEV_USING_DOCKER == "true")? process.env.DEV_MONGO_CONTAINER_URL : process.env.DEV_MONGO_LOCAL_URL 
    const databaseName = process.env.DATABASENAME
    const connectionUrl = `${mongoBaseUrl}/${databaseName}`
    
    console.log('(MONGOOSE) Using url:',connectionUrl)
    await mongoose.connect(mongoBaseUrl)
}

async function connectToDB() {
    await connect()
        .then(() => console.log('(MONGOOSE) Connected to MONGODB...'))
        .catch((e) => console.log('(MONGOOSE) Could not connect to database...', e))
}

module.exports = {
    connectToDB
}