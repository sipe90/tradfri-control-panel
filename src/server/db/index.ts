import config from 'config'
import sqlite, { Database } from 'sqlite'

import logger from '#/logger'
import SQL, { SQLStatement } from 'sql-template-strings'

interface IDbConfig {
    dbFolder: string
    dbName: string
}

const dbConfig: IDbConfig = config.get('database')

let dbConnection: Database

export const all = async <T = any> (sql: SQLStatement) => getConnection().all<T>(sql)
export const get = async <T = any> (sql: SQLStatement) =>  getConnection().get<T>(sql)
export const run = async (sql: SQLStatement) => getConnection().run(sql)

export const ins = async (sql: SQLStatement) => (await run(sql)).lastID
export const del = async (sql: SQLStatement) => (await run(sql)).changes > 0
export const upd = del

export const transactional = async <R = void> (statements: () => Promise<R>) => {
    try {
        run(SQL`BEGIN`)
        const result = await statements()
        run(SQL`COMMIT`)
        return result
    } catch (e) {
        run(SQL`ROLLBACK`)
        throw e
    }
}

export const init = async (_env: string) => {
    const connection = await connect()

    const migrationsPath = `${dbConfig.dbFolder}/migrations`

    // Re-apply latest migration on each startup when in dev environment
    const migrateOptions = {
        migrationsPath,
        // force: env === 'development' ? 'last' : undefined
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

export const getConnection = () => dbConnection
