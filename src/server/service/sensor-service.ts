import { normalizeSensors } from '#/data/tradfri'
import { getConnection } from '#/service/gateway-connection-manager'
import { getGateway } from '#/service/gateway-service'

export const getSensors = async () => {
    const gateway = await getGateway()
    if (!gateway || !gateway.connected) return []
    return normalizeSensors(getConnection().getSensors())
}
