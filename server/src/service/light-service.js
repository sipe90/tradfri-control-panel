const R = require('ramda')
const { getGateways, getLights } = require('service/gateway-service')


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

module.exports = {
    getAllLights
}
