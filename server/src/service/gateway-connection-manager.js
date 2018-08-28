const TradfriGateway = require('gateway/TradfriGateway')
const logger = require('logger')

let connection

const getConnection = () => {
    if (!connection) {
        throw Error('Not connected to any gateway')
    }
    return connection
}

const connectToGateway = async ({ hostname, identity, psk }) => {
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

module.exports = {
    connectToGateway,
    getConnection
}
