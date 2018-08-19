const R = require('ramda')
const { getGateways } = require('service/gateway-service')
const { getConnection } = require('service/gateway-connection-manager')
const { normalizeLights } = require('data/tradfri')
const logger = require('logger')

const getLights = async (gatewayId) => {
    const gateway = getConnection(gatewayId)
    logger.debug(`Loading lights for gateway ${gateway.getHostname()}`)
    return normalizeLights(gateway.getLights())
}

const collectLights =
    R.map( 
        R.ifElse(
            R.prop('connected'),
            (gateway) => getLights(gateway.id),
            R.always([])
        )
    )

const getAllLights = R.pipeP(
    getGateways,
    collectLights,
    Promise.all.bind(Promise),
    R.flatten
)

const updateLight = async (light) => {
    const gateways = await getGateways()
    const gateway = gateways.find((gateway) => R.contains(light.id, gateway.lights))
    if (!gateway) {
        throw new Error(`No light found with id: ${light.id}`)
    }
    const gatewayConnection = getConnection(gateway.id)
    gatewayConnection.updateLight(light)
}

module.exports = {
    getAllLights,
    updateLight
}
