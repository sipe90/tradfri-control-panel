const R = require('ramda')
const { getGateway } = require('service/gateway-service')
const { getConnection } = require('service/gateway-connection-manager')
const { normalizeSensors } = require('data/tradfri')

const getSensors = async () => {
    const gateway = await getGateway()
    if (!gateway || !gateway.connected)
        return []
    return normalizeSensors(getConnection().getSensors())
}

const updateSensor = async (sensor) => {
    const gateway = await getGateway()
    if (!gateway) {
        throw new Error('No gateway found')
    }
    if (!gateway.connected) {
        throw new Error('Gateway is not connected')
    }
    if (!R.contains(sensor.id, gateway.sensors)) {
        throw new Error(`No sensor found with id: ${sensor.id}`)
    }
    getConnection().updateSensor(sensor)
}

module.exports = {
    getSensors,
    updateSensor
}
