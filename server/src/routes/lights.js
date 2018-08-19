const express = require('express')
const router = express.Router()

const lightService = require('service/light-service')

router.get('/', (req, res, next) => 
    lightService.getAllLights()
        .then((result) => res.json(result))
        .catch(next)
)

router.post('/:id', (req, res, next) => 
    lightService.updateLight({ ...req.body, id: parseInt(req.params.id, 10)})
        .then((result) => res.json(result))
        .catch(next)
)

module.exports = router
