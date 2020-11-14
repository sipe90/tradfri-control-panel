import { findSettings, insert, remove, update } from '#/db/settings'
import { Omit } from 'shared'

export interface GatewayEntity {
    key: 'gateway'
    name: string
    hostname: string
    identity: string
    psk: string
}

export const getGateway: () => GatewayEntity | null = () =>
    findSettings('gateway')

export const insertGateway = (gateway: Omit<GatewayEntity, 'key'>) =>
    insert('gateway', gateway)

export const updateGateway = ({ name, hostname }: Partial<Omit<GatewayEntity, 'key'>>) => {
    if (!name || !hostname) return false

    const gateway = getGateway()
    if (!gateway) return false

    if (name) gateway.name = name
    if (hostname) gateway.hostname = hostname

    update(gateway)
}

export const deleteGateway = () => {
    const gateway = getGateway()
    if (!gateway) return false
    remove(gateway)
    return true
}
