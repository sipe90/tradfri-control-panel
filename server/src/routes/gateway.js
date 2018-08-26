const express = require('express')
const router = express.Router()

const gatewayService = require('service/gateway-service')

router.get('/', (req, res, next) =>
    gatewayService.getGateway()
        .then((result) => result ? res.json(result) : res.status(404).send())
        .catch(next)
)

router.get('/discover', (req, res, next) =>
    gatewayService.discoverGateway()
        .then((result) => res.json(result))
        .catch(next)
)

router.post('/', (req, res, next) =>
    gatewayService.createTradfriGateway(req.body)
        .then(() => res.status(201).send())
        .catch(next)
)

module.exports = router
