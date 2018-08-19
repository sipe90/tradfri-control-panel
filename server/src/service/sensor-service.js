const R = require('ramda')
const { getGateways } = require('service/gateway-service')
const { getConnection } = require('service/gateway-connection-manager')
const { normalizeSensors } = require('data/tradfri')
const logger = require('logger')

const getSensors = async (gatewayId) => {
    const gateway = getConnection(gatewayId)
    logger.debug(`Loading sensors for gateway ${gateway.getHostname()}`)
    return normalizeSensors(gateway.getSensors())
}

const collectSensors =
    R.map( 
        R.ifElse(
            R.prop('connected'),
            (gateway) => getSensors(gateway.id),
            R.always([])
        )
    )

const getAllSensors = R.pipeP(
    getGateways,
    collectSensors,
    Promise.all.bind(Promise),
    R.flatten
)

module.exports = {
    getAllSensors
}
