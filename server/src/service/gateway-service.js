const R = require('ramda')
const { models } = require('mongo')
const TradfriGateway = require('gateway/tradfri')
const logger = require('logger')
const { normalize } = require('data/tradfri')

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

const fetchGateways = async () =>  models.TradfriGateway.find()

const getGateways = async () => R.values(gateways)

const getGateway = async (id) => R.prop(id, gateways)

const getDevices = async (gatewayId) => {
    const gateway = connections[gatewayId]
    if (!gateway) {
        throw Error(`Uknown gateway id: ${gatewayId}`)
    }
    logger.debug(`Loading devices for gateway ${R.path([gatewayId, 'name'], gateways)}`)
    if (gateway instanceof TradfriGateway) {
        return normalize(gateway)
    }
}

const getAllDevices = async () => Promise.all(R.keys(gateways).map(getDevices))

const connectToGateways = async () => {
    const gatewayDocs =  await fetchGateways()
    logger.info(`Found ${gatewayDocs.length} gateways from database`)
    gateways = R.empty(gateways)
    connections = R.empty(connections)
    await Promise.all(R.map(connectToGateway, gatewayDocs))
}

const connectToGateway = async ({id, _type, name, hostname, auth}) => {
    if (_type === 'tradfri') {
        logger.info(`Connecting to a trådfri gateway at hostname ${hostname}`)
        const gateway = new TradfriGateway(hostname)
        
        let connected
        try {
            await gateway.connect(auth.identity, auth.psk)
            connected = true
            logger.info(`Successfully connected to trådfri gateway at ${hostname}`)
        } catch (err) {
            connected = false
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
    getDevices,
    getAllDevices
}
