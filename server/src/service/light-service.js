const R = require('ramda')
const { getGateways, getGateway } = require('service/gateway-service')
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

const updateLight = async (gatewayId, light) => {
    const gateway = await getGateway(gatewayId)
    if (!gateway) {
        throw new Error(`No gateway found with id: ${gatewayId}`)
    }
    if (!R.contains(light.id, gateway.lights)) {
        throw new Error(`No light found with id: ${light.id} for gateway id: ${gatewayId}`)
    }
    const gatewayConnection = getConnection(gatewayId)
    if (!gatewayConnection.isConnected()) {
        throw new Error(`Gateway id: ${gatewayId} is not connected`)
    }
    gatewayConnection.updateLight(light)
}

module.exports = {
    getAllLights,
    updateLight
}
