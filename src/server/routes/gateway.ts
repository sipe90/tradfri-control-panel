import express from 'express'

import { created, noContent, okOrNotFound } from '#/routes/responses'
import {
    createTradfriGateway, discoverGateway, generateIdentity,
    getGateway, testConnect, updateTradfriGateway
} from '#/service/gateway-service'

const router = express.Router()

router.get('/', (_req, res, next) =>
    getGateway()
        .then(okOrNotFound(res))
        .catch(next)
)

router.get('/discover', (_req, res, next) =>
    discoverGateway()
        .then(okOrNotFound(res))
        .catch(next)
)

router.post('/identity', (req, res, next) =>
    generateIdentity(req.body)
        .then(okOrNotFound(res))
        .catch(next)
)

router.post('/test', (req, res, next) =>
    testConnect(req.body)
        .then(okOrNotFound(res))
        .catch(next)
)

router.post('/', (req, res, next) =>
    createTradfriGateway(req.body)
        .then(created(res))
        .catch(next)
)

router.post('/update', (req, res, next) =>
    updateTradfriGateway(req.body)
        .then(noContent(res))
        .catch(next)
)

export default router
