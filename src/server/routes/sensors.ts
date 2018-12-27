import express = require('express')
import { getSensors } from '#/service/sensor-service'

const router = express.Router()

router.get('/', (_req, res, next) =>
    getSensors()
        .then((result) => res.json(result))
        .catch(next)
)

export default router
