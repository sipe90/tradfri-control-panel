let express = require('express')
let router = express.Router()

router.get('/', (req, res) => {
    console.log('yo')
    res.json({ message: 'hi there' })
})

module.exports = router
