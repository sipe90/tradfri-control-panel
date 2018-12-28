import express from 'express'

import { getLights, updateLight } from '#/service/light-service'

const router = express.Router()

router.get('/', (_req, res, next) =>
    getLights()
        .then((result) => res.json(result))
        .catch(next)
)

router.post('/:id', (req, res, next) =>
    updateLight({ ...req.body, id: parseInt(req.params.id, 10) })
        .then(() => res.status(204))
        .catch(next)
)

export default router
