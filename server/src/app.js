const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const { hub } = require('routes')

let app = express()

let isDevEnv = app.get('env') === 'development'

app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.json({ message: 'Hello there' })
})

app.use('/api/hub', hub)

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
