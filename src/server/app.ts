#!/usr/bin/env node

import express, { Request, Response, NextFunction } from 'express'
import httpLogger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import { ValidationError } from '#/error'
import logger from '#/logger'
import init from '#/init'
import { gateway, lights, sensors, groups } from '#/routes'

const HOST = process.env.HOST || 'localhost'
const PORT = parseInt(process.env.SERVER_PORT || '8080', 10)

const app = express()

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
app.use('/api/groups', groups)

app.use('/api/*', (_req, res) =>
    res.status(404).json({
        error: 'Not Found'
    })
)

app.use('*', express.static('dist/index.html'))

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
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

app.listen(PORT, HOST, () => logger.info(`Listening on port ${PORT}`))
