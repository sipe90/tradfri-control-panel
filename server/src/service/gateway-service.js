const db = require('db/gateway')
const TradfriGateway = require('gateway/TradfriGateway')
const { getConnection, connectToGateway } = require('service/gateway-connection-manager')
const { normalizeDevices } = require('data/tradfri')

const fetchGateway = async () =>
    db.selectGateway()

const createTradfriGateway = async ({ name, hostname, identity, psk }) => {
    const gateway = new TradfriGateway(hostname)
    const connected = await gateway.connect(identity, psk)
    if (connected) {
        const id = await db.insertGateway({ name, hostname, identity, psk })
        await connectToGateway({ id, hostname, identity, psk })
        return true
    }
    return false
}

const getGateway = async () => {
    const gateway = await fetchGateway()
    const gatewayConnection = getConnection()

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
    fetchGateway,
    createTradfriGateway,
    getGateway,
    discoverGateway
}
