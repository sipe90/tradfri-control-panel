#!/usr/bin/env ts-node

import 'module-alias/register'

import jsonServer from 'json-server'
import path from 'path'
import gateway from './routes/gateway'
import settings from './routes/settings'

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use(jsonServer.rewriter({
    '/api/*': '/$1'
}))

server.use('/gateway', gateway)
server.use('/settings', settings)

server.use(router)

server.listen(8080, () => {
    // tslint:disable-next-line:no-console
    console.log('JSON Server is running on port 8080')
})
