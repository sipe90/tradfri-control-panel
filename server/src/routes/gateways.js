const express = require('express')
const router = express.Router()

const gatewayService = require('service/gateway-service')
const lightService = require('service/light-service')

router.get('/', (req, res, next) =>
    gatewayService.getGateways()
        .then((result) => res.json(result))
        .catch(next)
)

router.get('/discover', (req, res, next) =>
    gatewayService.discoverGateway()
        .then((result) => res.json(result))
        .catch(next)
)

router.get('/:id', (req, res, next) =>
    gatewayService.getGateway(req.params.id)
        .then((result) => res.json(result))
        .catch(next)
)

router.post('/tradfri', (req, res, next) =>
    gatewayService.createTradfriGateway(req.body)
        .then(() => res.status(201).send())
        .catch(next)
)

router.post('/:id/lights/:lightId', (req, res, next) =>
    lightService.updateLight(req.params.id, { ...req.body, id: parseInt(req.params.lightId, 10) })
        .then((result) => res.json(result))
        .catch(next)
)

module.exports = router
