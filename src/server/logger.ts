import winston from 'winston'
import path from 'path'

const { createLogger, format, transports: { Console, File } } = winston
const { combine, timestamp, printf } = format

const stringFormat = printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)

export default createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        stringFormat,
    ),
    transports: [
        new Console({
            handleExceptions: true
        }),
        new File({
            filename: path.join(__dirname, '../../logs/server.log')
        }),
        new File({
            level: 'error',
            filename: path.join(__dirname, '../../logs/error.log'),
            handleExceptions: true
        })
    ]
})
