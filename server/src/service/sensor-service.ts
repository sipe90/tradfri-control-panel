import { normalizeSensors } from '#/data/tradfri'
import { getConnection, isGatewayConnected } from '#/service/gateway-connection-manager'
import { getGateway } from '#/service/gateway-service'

export const getSensors = async () => {
    const gateway = await getGateway()
    if (!gateway || !isGatewayConnected()) return []
    return normalizeSensors(getConnection().getSensors())
}
