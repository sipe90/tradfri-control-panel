#!/usr/bin/env ts-node

import 'module-alias/register'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express, { NextFunction, Request, Response } from 'express'
import http from 'http'
import httpLogger from 'morgan'
import WebSocket from 'ws'

import { ValidationError } from '#/error'
import init from '#/init'
import logger from '#/logger'
import { gateway, groups, lights, sensors, settings } from '#/routes'

const HOST = process.env.HOST || 'localhost'
const PORT = parseInt(process.env.PORT || '8080', 10)

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const env = app.get('env')
const isDevEnv = env === 'development'

app.use(httpLogger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

if (isDevEnv) {
    app.set('json spaces', 2)
}

init(wss, env).catch((err) => {
    logger.error(err)
    logger.error('Failed to initialize application. The process will now exit')
    process.exit(1)
})

app.use(express.static('dist'))

app.use('/api/gateway', gateway)
app.use('/api/lights', lights)
app.use('/api/sensors', sensors)
app.use('/api/groups', groups)
app.use('/api/settings', settings)

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

server.listen(PORT, HOST, () => logger.info(`Listening on ${HOST}:${PORT}`))
