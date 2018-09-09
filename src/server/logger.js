const winston = require('winston')
const path = require('path')

const { createLogger, format, transports: { Console, File } } = winston
const { combine, timestamp, printf } = format

const stringFormat = printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)

const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        stringFormat,
    ),
    transports: [
        new Console({
            handleExceptions: true
        }),
        new File({
            name: 'logfile',
            filename: path.join(__dirname, '../../logs/server.log')
        }),
        new File({
            name: 'errorlogfile',
            level: 'error',
            filename: path.join(__dirname, '../../logs/error.log'),
            handleExceptions: true
        })
    ]
})

module.exports = logger
