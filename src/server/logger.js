const winston = require('winston')
const path = require('path')

const { Logger, transports: { Console, File } } = winston

const logger = new Logger({
    transports: [
        new Console(),
        new File({
            name: 'logfile',
            filename: path.join(__dirname, '../../logs/server.log'),
            json: false
        }),
        new File({
            name: 'errorlogfile',
            level: 'error',
            filename: path.join(__dirname, '../../logs/error.log'),
            json: false
        }),
    ]
})

module.exports = logger
