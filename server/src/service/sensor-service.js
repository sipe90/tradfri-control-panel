const R = require('ramda')
const { getGateways, getSensors } = require('service/gateway-service')


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
