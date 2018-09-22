const express = require('express')
const router = express.Router()

const groupService = require('service/group-service')

router.get('/', (req, res, next) =>
    groupService.getGroups()
        .then((result) => res.json(result))
        .catch(next)
)

router.post('/:id', (req, res, next) =>
    groupService.updateGroup({ ...req.body, id: parseInt(req.params.id, 10) })
        .then((result) => res.json(result))
        .catch(next)
)

module.exports = router
