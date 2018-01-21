const express = require('express')
const path = require('path')
const httpLogger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const logger = require('logger')
const { gateway } = require('routes')
const mongo = require('mongo')

let app = express()

let isDevEnv = app.get('env') === 'development'

app.use(httpLogger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongo.connect()
    .then(() => logger.info('Successfully connected to MongoDB'))
    .catch((err) => { 
        logger.error('Failed to connect to MongoDB, the application will now exit.', err)
        process.exit(1)
    })

app.get('/', (req, res) => {
    res.json({ message: 'Hello there' })
})

app.use('/api/gateways', gateway)

app.use((req, res) => {
    res.status = 404
    res.json({
        error: 'Not Found'
    })
})

app.use((err, req, res) => {
    res.status(err.status || 500)
    res.json({
        error: isDevEnv ? err.message : 'Internal server error',
        stack: isDevEnv ? err.stack : undefined
    })
})

module.exports = app
