import express from 'express'

import {
    createTradfriGateway, discoverGateway, generateIdentity,
    getGateway, testConnect
} from '#/service/gateway-service'

const router = express.Router()

router.get('/', (_req, res, next) =>
    getGateway()
        .then((result) => result ? res.json(result) : res.status(404).send())
        .catch(next)
)

router.get('/discover', (_req, res, next) =>
    discoverGateway()
        .then((result) => result ? res.json(result) : res.status(404).send())
        .catch(next)
)

router.post('/identity', (req, res, next) =>
    generateIdentity(req.body)
        .then((result) => res.json(result))
        .catch(next)
)

router.post('/test', (req, res, next) =>
    testConnect(req.body)
        .then((result) => res.json(result))
        .catch(next)
)

router.post('/', (req, res, next) =>
    createTradfriGateway(req.body)
        .then(() => res.status(201).send())
        .catch(next)
)

export default router
