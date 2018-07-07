const express = require('express')
const path = require('path')
const httpLogger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const logger = require('logger')
const init = require('init')
const { gateways, lights } = require('routes')

let app = express()

const env =  app.get('env')
let isDevEnv = env === 'development'

app.use(httpLogger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

if (isDevEnv) {
    app.set('json spaces', 2)
}

init(env).then((success) => {
    if (!success) {
        logger.error('Failed to initialize application. The process will now exit')
        process.exit(1)
    }
})

app.get('/', (req, res) => 
    res.json({ message: 'Hello there' })
)

app.use('/api/gateways', gateways)
app.use('/api/lights', lights)

app.use((req, res) => {
    res.status = 404
    res.json({
        error: 'Not Found'
    })
})

app.use((err, req, res) => {
    res.status(err.status || 500)
    res.json({
        error: isDevEnv ? err.message : 'Internal server error',
        stack: isDevEnv ? err.stack : undefined
    })
})

module.exports = app
