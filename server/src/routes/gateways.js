const express = require('express')
const router = express.Router()

const gatewayService = require('service/gateway-service')

router.get('/', (req, res, next) => 
    gatewayService.getGateways()
        .then((result) => res.json(result))
        .catch(next)
)

router.post('/tradfri', (req, res, next) => 
    gatewayService.createTradfriGateway(req.body)
        .then(() => res.status(201).send())
        .catch(next)
)

module.exports = router
