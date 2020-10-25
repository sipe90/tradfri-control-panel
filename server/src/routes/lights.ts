import express from 'express'

import { noContent, ok } from '#/routes/responses'
import { getLights, updateLight } from '#/service/light-service'

const router = express.Router()

router.get('/', (_req, res, next) =>
    getLights()
        .then(ok(res))
        .catch(next)
)

router.post('/:id', (req, res, next) =>
    updateLight({ ...req.body, id: parseInt(req.params.id, 10) })
        .then(noContent(res))
        .catch(next)
)

export default router
