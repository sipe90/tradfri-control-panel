import { promises as fs } from 'fs'
import config from 'config'
import Loki from 'lokijs'

import * as settings from '#/db/settings'
import logger from '#/logger'

interface DbConfig {
    dbFolder: string
    dbName: string
}

const dbConfig: DbConfig = config.get('database')

let db: Loki

export const init = async (_env: string) => {
    db = await connect()
}

export const connect = async () => {
    const dbFilePath = `${dbConfig.dbFolder}/${dbConfig.dbName}`

    await fs.mkdir(dbConfig.dbFolder, { recursive: true })

    logger.info(`Connecting to low database at ${dbFilePath}`)

    return new Promise<Loki>((res, rej) => {
        db = new Loki(dbFilePath, {
            autoload: true,
            autoloadCallback: initDb(res, rej),
            autosave: true,
            serializationMethod: process.env.NODE_ENV === 'production' ? 'normal' : 'pretty'
        })
    })
}

export const getConnection = () => db

export const getCollection = (collectionName: string) => db.getCollection(collectionName)

const initDb = (res: (db: Loki) => void, rej: (err: any) => void) => (err: any) => {
    if (err) {
        return rej(err)
    }
    if (!settings.collectionExists()) {
        settings.createCollection()
    }
    res(db)
}
