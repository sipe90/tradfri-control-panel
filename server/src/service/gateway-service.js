const R = require('ramda')
const { models } = require('mongo')
const TradfriGateway = require('gateway/tradfri')
const logger = require('logger')

let gateways = {}

const createTradfriGateway = async ({hostname, identity, psk}) => {
    const gateway = await new TradfriGateway(hostname).connect(identity, psk)
    gateways.tradfri.push(gateway)
    await new models.TradfriGateway({ hostname, identity, psk}).save()
}

const fetchGateways = async () => {
    return models.TradfriGateway.find()
}

const connectToGateways = async () => {
    const gatewayDocs =  await fetchGateways()
    logger.info(`Found ${gatewayDocs.length} gateways from database`)
    let result = await Promise.all(R.map(connectToGateway, gatewayDocs))
    gateways = R.groupBy((gateway) => gateway.type, result)
}

const connectToGateway = async ({_type, hostname, auth}) => {
    if (_type === 'tradfri') {
        logger.info(`Connecting to a trådfri gateway at hostname ${hostname}`)
        const gateway = new TradfriGateway(hostname)
        if (await gateway.connect(auth.identity, auth.psk)) {
            logger.info(`Successfully connected to trådfri gateway at ${hostname}`)
        } else {
            logger.error(`Failed to connect to trådfri gateway at ${hostname}`)
        }
        return gateway
    }
}

module.exports = {
    createTradfriGateway,
    connectToGateways,
    fetchGateways
}
