import express from 'express'

import { ok } from '#/routes/responses'
import { getSensors } from '#/service/sensor-service'

const router = express.Router()

router.get('/', (_req, res, next) =>
    getSensors()
        .then(ok(res))
        .catch(next)
)

export default router
