const R = require('ramda')
const { Map } = require('immutable')
const { models } = require('mongo')
const TradfriGateway = require('gateway/tradfri')
const logger = require('logger')

let gateways = Map()
let connections = Map()

const createTradfriGateway = async ({name, hostname, identity, psk}) => {
    const gateway = new TradfriGateway(hostname)
    const connected = await gateway.connect(identity, psk)
    if (connected) {
        const { id } = await new models.TradfriGateway({ name, hostname, identity, psk}).save()
        gateways = gateways.set(id, Map({ id: id, type: 'tradfri', name, hostname, connected}))
        return true
    }
    return false
}

const fetchGateways = async () => {
    return models.TradfriGateway.find()
}

const getGateways = async () => Promise.resolve(gateways.valueSeq())

const getGateway = async (id) => Promise.resolve(gateways.get(id))

const getDevices = async (gatewayId) => new Promise((resolve) => {
    const gateway = connections.get(gatewayId)
    if (!gateway) {
        return resolve()
    }
    if (gateway instanceof TradfriGateway) {
        return resolve(normalizeTradfriDevices(gateway.getLights(), gateway.getSensors()))
    }
})

const normalizeTradfriDevices = (lights, sensors) => ({
    lights: R.map(
        (light) => ({
            id: light.instanceId,
            name: light.name,
            alive: light.alive,
            manufacturer: light.deviceInfo.manufacturer,
            model: light.deviceInfo.modelNumber,
            power: light.deviceInfo.power,
            battery: light.deviceInfo.battery,
            color: R.path(['lightList', 0, 'color'], light),
            colorTemperature: R.path(['lightList', 0, 'colorTemperature'], light),
            brightness:  R.path(['lightList', 0, 'dimmer'], light)
        }),
        lights
    ),
    sensors: R.map(
        (sensor) => ({
            id: sensor.instanceId,
            name: sensor.name,
            alive: sensor.alive,
            manufacturer: sensor.deviceInfo.manufacturer,
            model: sensor.deviceInfo.modelNumber,
            power: sensor.deviceInfo.power,
            battery: sensor.deviceInfo.battery
        }),
        sensors
    )
})

const connectToGateways = async () => {
    const gatewayDocs =  await fetchGateways()
    logger.info(`Found ${gatewayDocs.length} gateways from database`)
    gateways.clear()
    connections.clear() 
    await Promise.all(R.map(connectToGateway, gatewayDocs))
}

const connectToGateway = async ({id, _type, name, hostname, auth}) => {
    if (_type === 'tradfri') {
        logger.info(`Connecting to a trådfri gateway at hostname ${hostname}`)
        const gateway = new TradfriGateway(hostname)
        const connected = await gateway.connect(auth.identity, auth.psk)
        if (connected) {
            logger.info(`Successfully connected to trådfri gateway at ${hostname}`)
        } else {
            logger.error(`Failed to connect to trådfri gateway at ${hostname}`)
        }

        gateways = gateways.set(id, Map({ id, type: _type, name, hostname, connected}))
        connections = connections.set(id, gateway)
    } else {
        logger.error(`Unknown gateway type: ${_type}`)
    }
}

module.exports = {
    createTradfriGateway,
    connectToGateways,
    getGateways,
    getGateway,
    getDevices
}
