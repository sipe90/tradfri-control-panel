const mongoose = require('mongoose')
const config = require('config')

const logger = require('logger')
const dbConfig = config.get('database')
const models = require('mongo/models')

const connect = async () => {
    const credentials = dbConfig.username && dbConfig.password ? `${dbConfig.username}:${dbConfig.password}@` : ''
    const connectString = `mongodb://${credentials}${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`

    logger.info(`Connecting to MongoDB at ${dbConfig.password ? connectString.replace(dbConfig.password, 'XXXX') : connectString}`)

    return mongoose.connect(connectString)
}

module.exports = {
    connect,
    models
}
