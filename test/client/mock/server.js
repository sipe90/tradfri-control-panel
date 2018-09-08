const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

let gateway

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use(jsonServer.rewriter({
    '/api/*': '/$1'
}))

server.get('/gateway', (req, res) =>
    gateway ? res.json({
        ...gateway,
        connected: true
    }) : res.status(404).send()
)

server.get('/gateway/discover', (req, res) =>
    res.json({
        name: 'gw-b8d7af2aabd9',
        host: 'TRADFRI-Gateway-b8d7af2aabd9.local',
        addresses: ['192.168.0.9', 'fe80::bad7:afff:fe2a:abd9'],
        version: '1.4.15'
    })
)

server.post('/gateway/identity', (req, res) =>
    req.body.securityCode ?
        res.json({
            identity: 'tradfri_1234567890123',
            psk: 'FJwn5Yneho4gDXRk'
        }) : res.status(400).json({
            message: 'Security code is required',
            field: 'securityCode'
        })
)

server.post('/gateway/test', (req, res) =>
    res.json({
        success: true
    })
)

server.post('/gateway', (req, res) => {
    gateway = req.body
    res.status(201).send()
})

server.use(router)

server.listen(8080, () => {
    console.log('JSON Server is running')
})
