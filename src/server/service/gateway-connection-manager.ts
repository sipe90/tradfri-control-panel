import TradfriGateway from '#/gateway/TradfriGateway'
import logger from '#/logger'

interface IConnectProps {
    hostname: string
    identity: string
    psk: string
}

let connection: TradfriGateway | null = null

export const getConnection = () => {
    if (!connection) {
        throw Error('Cannot get connection: Not connected to gateway')
    }
    return connection
}

export const isGatewayConnected = () => connection ? connection.isConnected() : false

export const connectToGateway = async ({ hostname, identity, psk }: IConnectProps) => {
    logger.info(`Connecting to a trådfri gateway at hostname ${hostname}`)
    const gateway = new TradfriGateway(hostname, true)

    try {
        await gateway.connect(identity, psk)
        logger.info(`Successfully connected to trådfri gateway at ${hostname}`)
    } catch (err) {
        logger.error(`Failed to connect to trådfri gateway at ${hostname}`)
        logger.error(err)
    }

    connection = gateway
    return connection
}

export const disconnectFromGateway = (clear: boolean) => {
    logger.info('Disconnecting from gateway [clear=%b]', clear)
    if (!connection && !clear) {
        throw Error('Cannot disconnect: Not connected to gateway')
    }
    if (connection) {
        connection.disconnect()
        logger.info('Successfully disconnected from gateway')
    }
    if (clear) {
        logger.info('Clearing gateway connection')
        connection = null
    }
}
