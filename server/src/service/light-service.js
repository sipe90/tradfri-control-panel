const R = require('ramda')
const { getGateways, getDevices } = require('service/gateway-service')


const getLights =
    R.map((gateway) => 
        R.pipeP(
            R.ifElse(
                R.prop('connected'),
                (gateway) => getDevices(gateway.id),
                R.always({ lights: []})
            ),
            (devices) => R.assoc('lights', devices.lights, gateway)
        )(gateway),
    )

const getAllLights = R.pipeP(
    getGateways,
    getLights,
    Promise.all.bind(Promise)
)

module.exports = {
    getAllLights
}
