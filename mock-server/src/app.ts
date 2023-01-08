#!/usr/bin/env ts-node

import jsonServer from 'json-server'
import WebSocket from 'ws'
import http from 'http'

import gateway from './routes/gateway'
import settings from './routes/settings'


const app = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const server = http.createServer(app)

const wss = new WebSocket.Server({ server, path: '/ws' })

wss.on('connection', (ws, req) => {
    const { localAddress, localPort } = req.connection
    const address = `${localAddress}:${localPort}`

    console.log('WebSocket client connected from %s', address)

    ws.on('close', (code, reason) => {
        console.log('WebSocket client disconnected from %s. Code: %d, Reason: %s', address, code, reason)
    })

    ws.on('error', (error) => {
        console.log('WebSocket client from %s received an error', address)
        console.log(error)
    })
})

app.use(middlewares)
app.use(jsonServer.bodyParser)

app.use(jsonServer.rewriter({
    '/api/*': '/$1'
}))

app.use('/gateway', gateway)
app.use('/settings', settings)

app.use(router)

server.listen(8080, () => {
    console.log('JSON Server is running on port 8080')
})
