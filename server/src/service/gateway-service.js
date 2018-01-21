const { models: { TradfriGateway } } = require('mongo')
const logger = require('logger')

const createTradfriGateway = async ({hostname, identity, psk}) => {
    return new TradfriGateway({
        hostname: hostname,
        identity: identity,
        psk: psk
    }).save()
}

const getGateways = async () => {
    return TradfriGateway.find()
}

module.exports = {
    createTradfriGateway,
    getGateways
}
