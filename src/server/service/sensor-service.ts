import { getGateway } from 'service/gateway-service'
import { getConnection } from 'service/gateway-connection-manager'
import { normalizeSensors } from 'data/tradfri'

export const getSensors = async () => {
    const gateway = await getGateway()
    if (!gateway || !gateway.connected)
        return []
    return normalizeSensors(getConnection().getSensors())
}
