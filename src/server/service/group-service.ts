import R from 'ramda'

import { normalizeGroups } from '#/data/tradfri'
import { getConnection } from '#/service/gateway-connection-manager'
import { getGateway } from '#/service/gateway-service'
import { IGroupUpdateRequest } from 'shared/types'

export const getGroups = async () => {
    const gateway = await getGateway()
    if (!gateway || !gateway.connected) return []
    return normalizeGroups(getConnection().getGroups())
}

export const updateGroup = async (group: IGroupUpdateRequest) => {
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

    await connection.updateGroup(String(group.id), toGroupUpdate(group))
    await connection.operateGroup(String(group.id), toGroupOperation(group))
}

const toGroupUpdate = (group: IGroupUpdateRequest) => ({
    name: group.name
})

const toGroupOperation = (group: IGroupUpdateRequest) => ({
    onOff: group.on,
    dimmer: group.brightness
})
