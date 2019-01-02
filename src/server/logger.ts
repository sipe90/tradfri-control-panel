import path from 'path'
import winston from 'winston'

const { createLogger, format, transports: { Console, File } } = winston
const { combine, timestamp, printf, splat } = format

const stringFormat = printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)

const logger = createLogger({
    format: combine(
        splat(),
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

export default logger
