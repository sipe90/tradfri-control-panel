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
    Promise.all(R.map(connectToGateway, gatewayDocs))
}

const connectToGateway = async ({id, _type, hostname, auth}) => {
    if (_type === 'tradfri') {
        logger.info(`Connecting to a trådfri gateway at hostname ${hostname}`)
        const gateway = new TradfriGateway(hostname)
        
        try {
            await gateway.connect(auth.identity, auth.psk)
            logger.info(`Successfully connected to trådfri gateway at ${hostname}`)
        } catch (err) {
            logger.error(`Failed to connect to trådfri gateway at ${hostname}`)
            logger.error(err)
        }

        connections = R.assoc(id, gateway, connections)
        return gateway
    } else {
        logger.error(`Unknown gateway type: ${_type}`)
    }
}

module.exports = {
    connectToGateways,
    connectToGateway,
    getConnection
}
