import TradfriGateway from '#/gateway/TradfriGateway'
import logger from '#/logger'

interface ConnectProps {
    hostname: string;
    identity: string;
    psk: string;
}

let connection: TradfriGateway

export const getConnection = () => {
    if (!connection) {
        throw Error('Not connected to any gateway')
    }
    return connection
}

export const connectToGateway = async ({ hostname, identity, psk }: ConnectProps) => {
    logger.info(`Connecting to a trådfri gateway at hostname ${hostname}`)
    const gateway = new TradfriGateway(hostname)

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
