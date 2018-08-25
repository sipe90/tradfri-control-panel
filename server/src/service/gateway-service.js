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
