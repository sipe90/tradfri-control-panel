const R = require('ramda')
const db = require('db/gateway')
const TradfriGateway = require('gateway/TradfriGateway')
const { getConnection, connectToGateway } = require('service/gateway-connection-manager')
const { normalizeDevices } = require('data/tradfri')

const fetchGateways = async () =>
    db.selectAllGateways()

const fetchGateway = async (gatewayId) =>
    db.selectGatewayById(gatewayId)

const createTradfriGateway = async ({name, hostname, identity, psk}) => {
    const gateway = new TradfriGateway(hostname)
    const connected = await gateway.connect(identity, psk)
    if (connected) {
        const id = await db.insertGateway({ name, hostname, identity, psk})
        await connectToGateway({ id, hostname, identity, psk })
        return true
    }
    return false
}

const getGateways = async () => {
    const gateways = await fetchGateways()

    return Promise.all(R.map(async (gateway) => {
        let gatewayConnection = getConnection(gateway.id)

        if (!gatewayConnection) {
            await connectToGateway(gateway)
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
    const gateway = await fetchGateway(id)
    const gatewayConnection = getConnection(id)

    if (!gatewayConnection) {
        return null
    } 
    
    return ({
        ...gateway,
        connected: gatewayConnection.isConnected(),
        ...normalizeDevices(gatewayConnection.getLights(), gatewayConnection.getSensors())
    })
}

const discoverGateway = async () => TradfriGateway.discover()

module.exports = {
    fetchGateways,
    fetchGateway,
    createTradfriGateway,
    getGateways,
    getGateway,
    discoverGateway
}
