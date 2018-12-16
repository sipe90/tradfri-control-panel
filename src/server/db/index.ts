import sqlite, { Database } from 'sqlite'
import config from 'config'
import logger from 'logger'

interface DbConfig {
    dbFolder: string;
    dbName: string;
}

const dbConfig: DbConfig = config.get('database')

let dbConnection: Database

export const init = async (_env: string) => {
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

export const connect = async () => {
    const dbFilePath = `${dbConfig.dbFolder}/${dbConfig.dbName}`

    logger.info(`Connecting to SQLite3 db at ${dbFilePath}`)

    dbConnection = await sqlite.open(dbFilePath)

    return dbConnection
}

export const getConnection = async () => dbConnection
