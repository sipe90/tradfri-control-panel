import express from 'express'
import { GatewayConnectionState, ICreateGatewayRequest, Gateway, IUpdateGatewayRequest } from '@tradfri-control-panel/shared'

const router = express.Router()

let gateway: Gateway | null

router.get('/', (_req, res) =>
    gateway ? res.json(gateway) : res.sendStatus(404)
)

router.post('/', (req, res) => {
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

router.post('/update', (req, res) => {
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

router.get('/discover', (_req, res) =>
    res.json({
        name: 'gw-b8d7af2aabd9',
        host: 'TRADFRI-Gateway-b8d7af2aabd9.local',
        addresses: ['192.168.0.9', 'fe80::bad7:afff:fe2a:abd9'],
        version: '1.4.15'
    })
)

router.post('/identity', (req, res) =>
    req.body.securityCode ?
        res.json({
            identity: 'tradfri_1234567890123',
            psk: 'FJwn5Yneho4gDXRk'
        }) : res.status(400).json({
            message: 'Security code is required',
            field: 'securityCode'
        })
)

router.post('/test', (_req, res) =>
    res.json({
        success: true
    })
)

router.post('/reboot', (_req, res) => {
    if (!gateway) return res.sendStatus(404)
    simulateConnectionLoss(5000, 20000)
    res.status(204).send()
})

router.post('/reset', (_req, res) => {
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

export default router
