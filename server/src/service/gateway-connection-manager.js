const R = require('ramda')
const TradfriGateway = require('gateway/TradfriGateway')
const logger = require('logger')

let connections = {}

const getConnection = (gatewayId) => {
    const gateway = connections[gatewayId]
    if (!gateway) {
        throw Error(`Uknown gateway id: ${gatewayId}`)
    }
    return gateway
}

const connectToGateways = async (gatewayDocs) => {
    connections = {}
    return Promise.all(R.map(connectToGateway, gatewayDocs))
}

const connectToGateway = async ({id, hostname, identity, psk}) => {
    logger.info(`Connecting to a trådfri gateway at hostname ${hostname}`)
    const gateway = new TradfriGateway(hostname)
    
    try {
        await gateway.connect(identity, psk)
        logger.info(`Successfully connected to trådfri gateway at ${hostname}`)
    } catch (err) {
        logger.error(`Failed to connect to trådfri gateway at ${hostname}`)
        logger.error(err)
    }

    connections = R.assoc(id, gateway, connections)
    return gateway
}

module.exports = {
    connectToGateways,
    connectToGateway,
    getConnection
}
