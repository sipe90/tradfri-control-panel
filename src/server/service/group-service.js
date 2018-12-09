const R = require('ramda')
const { getGateway } = require('service/gateway-service')
const { getConnection } = require('service/gateway-connection-manager')
const { normalizeGroups } = require('data/tradfri')

const getGroups = async () => {
    const gateway = await getGateway()
    if (!gateway || !gateway.connected)
        return []
    return normalizeGroups(getConnection().getGroups())
}

const updateGroup = async (group) => {
    const gateway = await getGateway()
    if (!gateway) {
        throw new Error('No gateway found')
    }
    if (!gateway.connected) {
        throw new Error('Gateway is not connected')
    }
    if (!R.contains(group.id, gateway.groups)) {
        throw new Error(`No group found with id: ${group.id}`)
    }

    const connection = getConnection()

    await connection.updateGroup(group.id, toGroupUpdate(group))
    await connection.operateGroup(group.id, toGroupOperation(group))
}

const toGroupUpdate = (group) => ({
    name: group.name
})

const toGroupOperation = (group) => ({
    onOff: group.on,
    dimmer: group.brightness
})

module.exports = {
    getGroups,
    updateGroup
}
