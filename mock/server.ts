#!/usr/bin/env ts-node

import 'module-alias/register'

import jsonServer from 'json-server'
const server = jsonServer.create()
import path from 'path'
import { GatewayConnectionState, ICreateGatewayRequest, IGateway, IUpdateGatewayRequest } from 'shared/types'
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

let gateway: IGateway | null

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use(jsonServer.rewriter({
    '/api/*': '/$1'
}))

server.get('/gateway', (_req, res) =>
    gateway ? res.json(gateway) : res.sendStatus(404)
)

server.get('/gateway/discover', (_req, res) =>
    res.json({
        name: 'gw-b8d7af2aabd9',
        host: 'TRADFRI-Gateway-b8d7af2aabd9.local',
        addresses: ['192.168.0.9', 'fe80::bad7:afff:fe2a:abd9'],
        version: '1.4.15'
    })
)

server.post('/gateway/identity', (req, res) =>
    req.body.securityCode ?
        res.json({
            identity: 'tradfri_1234567890123',
            psk: 'FJwn5Yneho4gDXRk'
        }) : res.status(400).json({
            message: 'Security code is required',
            field: 'securityCode'
        })
)

server.post('/gateway/test', (_req, res) =>
    res.json({
        success: true
    })
)

server.post('/gateway', (req, res) => {
    gateway = {
        ...req.body as ICreateGatewayRequest,
        connectionState: GatewayConnectionState.CONNECTED,
        alexaPairStatus: false,
        googleHomePairStatus: false,
        version: '1.4.15',
        updateProgress: 0,
        updatePriority: 5,
        releaseNotes: ''
    }
    res.sendStatus(201)
})

server.post('/gateway/update', (req, res) => {
    if (!gateway) return res.sendStatus(404)
    if (gateway.hostname !== req.body.name) {
        simulateConnectionLoss(5000, 20000)
    }
    gateway = {
        ...gateway,
        ...req.body as IUpdateGatewayRequest,
    }
    res.sendStatus(204)
})

server.post('/gateway/reboot', (_req, res) => {
    if (!gateway) return res.sendStatus(404)
    simulateConnectionLoss(5000, 20000)
    res.status(204).send()
})

server.post('/gateway/reset', (_req, res) => {
    if (!gateway) return res.sendStatus(404)
    gateway = null
    res.sendStatus(204)
})

const simulateConnectionLoss = (startAfter: number, recoverAfter: number) => {
    setTimeout(() => {
        if (gateway) {
            gateway.connectionState = GatewayConnectionState.OFFLINE
            setTimeout(() => {
                if (gateway) {
                    gateway.connectionState = GatewayConnectionState.CONNECTED
                }
            }, recoverAfter)
        }
    }, startAfter)
}

server.use(router)

server.listen(8080, () => {
    // tslint:disable-next-line:no-console
    console.log('JSON Server is running on port 8080')
})
