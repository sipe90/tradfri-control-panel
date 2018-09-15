#!/usr/bin/env node

const express = require('express')
const httpLogger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const { ValidationError } = require('error')
const logger = require('logger')
const init = require('init')
const { gateway, lights, sensors } = require('routes')

let app = express()

const env = app.get('env')
let isDevEnv = env === 'development'

app.use(httpLogger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

if (isDevEnv) {
    app.set('json spaces', 2)
}

init(env).then((success) => {
    if (!success) {
        logger.error('Failed to initialize application. The process will now exit')
        process.exit(1)
    }
})

app.use(express.static('dist'))

app.use('/api/gateway', gateway)
app.use('/api/lights', lights)
app.use('/api/sensors', sensors)

app.use('/api/*', (req, res) =>
    res.status(404).json({
        error: 'Not Found'
    })
)

app.use('*', express.static('dist/index.html'))

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof ValidationError) {
        return res.status(err.status).json({
            field: err.field,
            message: err.message
        })
    }

    logger.error(err)

    return res.status(err.status || 500).json({
        message: isDevEnv ? err.message : 'Internal server error',
        stack: isDevEnv ? err.stack : undefined
    })
})

const port = process.env.SERVER_PORT || 8080

app.listen(port, () => logger.info(`Listening on port ${port}`))
