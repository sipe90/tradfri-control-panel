import express from 'express'

import { noContent, okOrNotFound } from '#/routes/responses'
import { getCircadianSettings, updateCircadianSettings } from '#/service/circadian-service'

const router = express.Router()

router.get('/circadian', (_req, res, next) =>
    getCircadianSettings()
        .then(okOrNotFound(res))
        .catch(next)
)

router.post('/circadian', (req, res, next) =>
    updateCircadianSettings(req.body)
        .then(noContent(res))
        .catch(next)
)

export default router
