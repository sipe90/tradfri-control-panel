import express from 'express'

import { noContent, ok } from '#/routes/responses'
import { getGroups, updateGroup } from '#/service/group-service'

const router = express.Router()

router.get('/', (_req, res, next) =>
    getGroups()
        .then(ok(res))
        .catch(next)
)

router.post('/:id', (req, res, next) =>
    updateGroup({ ...req.body, id: parseInt(req.params.id, 10) })
        .then(noContent(res))
        .catch(next)
)

export default router
