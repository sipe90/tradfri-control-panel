import WebSocket, { OPEN } from 'ws'

import logger from '#/logger'
import { IWSPayload } from 'shared/types'

export default class WebSocketBroker {

    private server: WebSocket.Server

    constructor(server: WebSocket.Server) {
        this.server = server
        this.setupInternalObservers()
    }

    public broadcast(data: IWSPayload) {
        this.server.clients.forEach((client) =>
            client.readyState === OPEN && client.send(JSON.stringify(data), sendCallback(data)))
    }

    private setupInternalObservers = () => {
        this.server.on('connection', (ws, req) => {

            const { localAddress, localPort } = req.connection
            const address = `${localAddress}:${localPort}`

            logger.info('WebSocket client connected from %s', address)

            ws.on('close', (code, reason) => {
                logger.info('WebSocket client disconnected from %s. Code: %d, Reason: %s', address, code, reason)
            })

            ws.on('error', (error) => {
                logger.error('WebSocket client from %s received an error', address)
                logger.error(error)
            })
        })

        this.server.on('error', (error) => {
            logger.error('Error occurred on the WebSocket server:')
            logger.error(error)
        })

        const serverAddress = this.server.address()
        const url = typeof serverAddress === 'string' ?
            `ws://${serverAddress}` : `ws://${serverAddress.address}:${serverAddress.port}`
        logger.info('WebSocket server listening on %s ', url)
    }
}

const sendCallback = ({type, entity, data}: IWSPayload) => (err: Error | undefined) => {
    if (err) {
        logger.error('Failed to send websocket data type: %s, entity: %s, data: %s', type, entity, data)
        logger.error(err)
    }
}
