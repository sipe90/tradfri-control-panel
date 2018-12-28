import express from 'express'

import { getGroups, updateGroup } from '#/service/group-service'

const router = express.Router()

router.get('/', (_req, res, next) =>
    getGroups()
        .then((result) => res.json(result))
        .catch(next)
)

router.post('/:id', (req, res, next) =>
    updateGroup({ ...req.body, id: parseInt(req.params.id, 10) })
        .then((result) => res.json(result))
        .catch(next)
)

export default router
