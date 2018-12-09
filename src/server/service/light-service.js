const R = require('ramda')
const { getGateway } = require('service/gateway-service')
const { getConnection } = require('service/gateway-connection-manager')
const { normalizeLights } = require('data/tradfri')

const getLights = async () => {
    const gateway = await getGateway()
    if (!gateway || !gateway.connected)
        return []
    return normalizeLights(getConnection().getLights())
}

const updateLight = async (light) => {
    const gateway = await getGateway()
    if (!gateway) {
        throw new Error('No gateway found')
    }
    if (!gateway.connected) {
        throw new Error('Gateway is not connected')
    }
    if (!R.contains(light.id, gateway.lights)) {
        throw new Error(`No light found with id: ${light.id}`)
    }

    const connection = getConnection()

    await connection.updateLight(light.id, toLightUpdate(light))
    await connection.operateLight(light.id, toLightOperation(light))
}

const toLightUpdate = (light) => ({
    name: light.name
})

const toLightOperation = (light) => ({
    onOff: light.on,
    dimmer: light.brightness,
    colorTemperature: light.colorTemperature
})

module.exports = {
    getLights,
    updateLight
}
