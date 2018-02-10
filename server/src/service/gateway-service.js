const R = require('ramda')
const { models } = require('mongo')
const TradfriGateway = require('gateway/tradfri')
const logger = require('logger')

let gateways = {}

const createTradfriGateway = async ({name, hostname, identity, psk}) => {
    const gateway = new TradfriGateway(hostname)
    const connected = await gateway.connect(identity, psk)
    if (connected) {
        gateways.tradfri.push(gateway)
        await new models.TradfriGateway({ name, hostname, identity, psk}).save()
        return true
    }
    return false
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
        const connected = await gateway.connect(auth.identity, auth.psk)
        if (connected) {
            const groups = gateway.getGroups()
            const devices = gateway.getDevices()
            logger.info(`Successfully connected to trådfri gateway at ${hostname} ` +
                `with ${Object.keys(groups).length} groups and ${Object.keys(devices).length} devices`)
            logger.debug(`Groups: ${JSON.stringify(groups, null, 2)}`)
            logger.debug(`Devices: ${JSON.stringify(devices, null, 2)}`)
        } else {
            logger.error(`Failed to connect to trådfri gateway at ${hostname}`)
        }

        return gateway
    }
    logger.error(`Unknown gateway type: ${_type}`)
}

module.exports = {
    createTradfriGateway,
    connectToGateways,
    fetchGateways
}
