const R = require('ramda')
const { models } = require('mongo')
const TradfriGateway = require('gateway/TradfriGateway')
const logger = require('logger')
const { normalizeGateway, normalizeLights, normalizeSensors } = require('data/tradfri')

let gateways = {}
let connections = {}

const createTradfriGateway = async ({name, hostname, identity, psk}) => {
    const gateway = new TradfriGateway(hostname)
    const connected = await gateway.connect(identity, psk)
    if (connected) {
        const { id } = await new models.TradfriGateway({ name, hostname, identity, psk}).save()
        gateways = R.assoc(id, { id: id, type: 'tradfri', name, hostname, connected}, gateways)
        return true
    }
    return false
}

const gatewayExists = (id) => R.has(id, gateways)

const getGateways = async () => Promise.all(
    R.map(getGateway, R.keys(gateways))
)

const getGateway = async (id) => gatewayExists(id) ? ({
    ...gateways[id],
    ...normalizeGateway(connections[id])
}) : null

const getLights = async (gatewayId) => {
    const gateway = connections[gatewayId]
    if (!gateway) {
        throw Error(`Uknown gateway id: ${gatewayId}`)
    }
    logger.debug(`Loading lights for gateway ${R.path([gatewayId, 'name'], gateways)}`)
    return normalizeLights(gateway)
}

const getSensors = async (gatewayId) => {
    const gateway = connections[gatewayId]
    if (!gateway) {
        throw Error(`Uknown gateway id: ${gatewayId}`)
    }
    logger.debug(`Loading sensors for gateway ${R.path([gatewayId, 'name'], gateways)}`)
    return normalizeSensors(gateway)
}

const connectToGateways = async () => {
    const gatewayDocs =  await models.TradfriGateway.find()
    logger.info(`Found ${gatewayDocs.length} gateways from database`)
    gateways = R.empty(gateways)
    connections = R.empty(connections)
    await Promise.all(R.map(connectToGateway, gatewayDocs))
}

const connectToGateway = async ({id, _type, name, hostname, auth}) => {
    if (_type === 'tradfri') {
        logger.info(`Connecting to a trådfri gateway at hostname ${hostname}`)
        const gateway = new TradfriGateway(hostname)
        
        let connected = false
        try {
            await gateway.connect(auth.identity, auth.psk)
            connected = true
            logger.info(`Successfully connected to trådfri gateway at ${hostname}`)
        } catch (err) {
            logger.error(`Failed to connect to trådfri gateway at ${hostname}`)
            logger.error(err)
        }

        gateways = R.assoc(id, { id, type: _type, name, hostname, connected}, gateways)
        connections = R.assoc(id, gateway, connections)
    } else {
        logger.error(`Unknown gateway type: ${_type}`)
    }
}

module.exports = {
    createTradfriGateway,
    connectToGateways,
    getGateways,
    getGateway,
    getLights,
    getSensors,
}
