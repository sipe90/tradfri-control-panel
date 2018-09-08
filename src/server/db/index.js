const sqlite  = require('sqlite')
const config = require('config')
const logger = require('logger')

const dbConfig = config.get('database')

let dbConnection

const init = async (env) => {
    const connection = await connect()

    const migrationsPath = `${dbConfig.dbFolder}/migrations`

    // Re-apply latest migration on each startup when in dev environment
    const migrateOptions = {
        migrationsPath,
        //force: env === 'development' ? 'last' : undefined
    }

    logger.info('Migrating database')
    await connection.migrate(migrateOptions)
}

const connect = async () => {
    const dbFilePath = `${dbConfig.dbFolder}/${dbConfig.dbName}`

    logger.info(`Connecting to SQLite3 db at ${dbFilePath}`)

    dbConnection = sqlite.open(dbFilePath)

    return dbConnection
}

const getConnection = async () => dbConnection

module.exports = {
    init,
    connect,
    getConnection
}

