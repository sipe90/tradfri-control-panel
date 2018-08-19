const R = require('ramda')
const { models } = require('mongo')
const TradfriGateway = require('gateway/TradfriGateway')
const { getConnection, connectToGateway, connectToGateways } = require('service/gateway-connection-manager')
const { normalizeDevices } = require('data/tradfri')

const fetchGateways = async () =>
    await models.TradfriGateway.find().exec()

const fetchGateway = async (gatewayId) =>
    await models.TradfriGateway.findOne(gatewayId).exec()

const createTradfriGateway = async ({name, hostname, identity, psk}) => {
    const gateway = new TradfriGateway(hostname)
    const connected = await gateway.connect(identity, psk)
    if (connected) {
        const gatewayDoc = await models.TradfriGateway({ name, hostname, identity, psk}).save()
        await connectToGateway(gatewayDoc)
        return true
    }
    return false
}

const getGateways = async () => {
    const gateways = await fetchGateways()

    return Promise.all(R.map(async (gatewayDoc) => {
        const gateway = mapGatewayFields(gatewayDoc)
        let gatewayConnection = getConnection(gateway.id)

        if (!gatewayConnection) {
            await connectToGateway(gatewayDoc)
            gatewayConnection = getConnection(gateway.id)
        }

        return ({
            ...gateway,
            connected: gatewayConnection.isConnected(),
            ...normalizeDevices(gatewayConnection.getLights(), gatewayConnection.getSensors())
        })
    }, gateways))
}

const getGateway = async (id) => { 
    const gatewayDoc = await fetchGateway(id)
    const gatewayConnection = getConnection(id)

    if (!gatewayDoc || !gatewayConnection) {
        return null
    } 

    const gateway = mapGatewayFields(gatewayDoc)
    
    return ({
        ...gateway,
        connected: gatewayConnection.isConnected(),
        ...normalizeDevices(gatewayConnection.getLights(), gatewayConnection.getSensors())
    })
}

const mapGatewayFields = ({_id, _type, name, hostname }) => ({ 
    id: _id, 
    type: _type,
    name, 
    hostname
})

module.exports = {
    fetchGateways,
    fetchGateway,
    createTradfriGateway,
    getGateways,
    getGateway
}
