import R from 'ramda'
import { getGateway } from '#/service/gateway-service'
import { getConnection } from '#/service/gateway-connection-manager'
import { normalizeLights } from '#/data/tradfri'
import { Light } from 'shared/types';

export const getLights = async () => {
    const gateway = await getGateway()
    if (!gateway || !gateway.connected)
        return []
    return normalizeLights(getConnection().getLights())
}

export const updateLight = async (light: Light) => {
    const gateway = await getGateway()
    if (!gateway) {
        throw new Error('No gateway found')
    }
    if (!gateway.connected) {
        throw new Error('Gateway is not connected')
    }
    if (!R.contains(light.id, gateway.lights)) {
        throw new Error(`No light found with id: ${light.id}`)
    }

    const connection = getConnection()

    await connection.updateLight(String(light.id), toLightUpdate(light))
    await connection.operateLight(String(light.id), toLightOperation(light))
}

const toLightUpdate = (light: Light) => ({
    name: light.name
})

const toLightOperation = (light: Light) => ({
    onOff: light.on,
    dimmer: light.brightness,
    colorTemperature: light.colorTemperature
})
