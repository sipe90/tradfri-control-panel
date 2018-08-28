const { TradfriErrorCodes } = require('node-tradfri-client')
const db = require('db/gateway')
const TradfriGateway = require('gateway/TradfriGateway')
const { getConnection, connectToGateway } = require('service/gateway-connection-manager')
const { normalizeDevices } = require('data/tradfri')
const { ValidationError } = require('error')

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

    if (!gateway) {
        return null
    }

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

const generateIdentity = async ({ hostname, securityCode }) => {
    if (!hostname) {
        throw new ValidationError('Hostname is required', 'hostname')
    }
    if (!securityCode) {
        throw new ValidationError('Security code is required', 'securityCode')
    }
    const gateway = new TradfriGateway(hostname)

    try {
        return await gateway.authenticate(securityCode)
    } catch (err) {
        if (err.code == TradfriErrorCodes.AuthenticationFailed) {
            throw new ValidationError(err.message, 'securityCode')
        }
        throw new ValidationError(err.message)
    }
}

const testConnect = async ({ hostname, identity, psk }) => {
    if (!hostname) {
        throw new ValidationError('Hostname is required', 'hostname')
    }
    if (!identity) {
        throw new ValidationError('Identity is required', 'identity')
    }
    if (!psk) {
        throw new ValidationError('Pre-saher key is required', 'psk')
    }
    const gateway = new TradfriGateway(hostname)

    try {
        gateway.connect(identity, psk, false)
        gateway.disconnect()
        return { success: true }
    } catch (err) {
        return {
            success: false,
            error: err.message
        }
    }
}

module.exports = {
    fetchGateway,
    createTradfriGateway,
    getGateway,
    discoverGateway,
    generateIdentity,
    testConnect
}
