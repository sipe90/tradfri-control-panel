const R = require('ramda')
const { getGateways, getDevices } = require('service/gateway-service')


const getSensors =
    R.map((gateway) => 
        R.pipeP(
            R.ifElse(
                R.prop('connected'),
                (gateway) => getDevices(gateway.id),
                R.always({ sensors: []})
            ),
            (devices) => R.assoc('sensors', devices.sensors, gateway)
        )(gateway),
    )

const getAllSensors = R.pipeP(
    getGateways,
    getSensors,
    Promise.all.bind(Promise)
)

module.exports = {
    getAllSensors
}
