import WebSocket from 'ws'

import * as db from '#/db'
import logger from '#/logger'
import { setupCircadian } from '#/service/circadian-service'
import * as manager from '#/service/gateway-connection-manager'
import { fetchGateway } from '#/service/gateway-service'
import WebSocketBroker from './component/WebSocketBroker'

const logError = (logMsg: string) => (err: Error) => {
    logger.error(logMsg, err)
    return Promise.reject(err)
}

export default async (wss: WebSocket.Server, env: string) => {
    logger.info('Initializing application')

    await db.init(env).catch(logError('Failed to connect to LokiJS database.'))

    logger.info('Successfully connected to LokiJS database')

    logger.info('Fetching gateway from database')
    const gateway = await fetchGateway()

    manager.setBroker(new WebSocketBroker(wss))

    if (!gateway) {
        logger.info('No gateway found from database')
        return
    }

    logger.info('Found gateway from database')

    const { hostname, identity, psk } = gateway
    await manager.connectToGateway(hostname, identity, psk).catch(logError('Failed to connect to Gateway'))

    logger.info('Setting up gateway observers')

    manager.observeGateway()

    logger.info('Finished connecting to gateway')

    logger.info('Setting up circadian')

    await setupCircadian()
}
