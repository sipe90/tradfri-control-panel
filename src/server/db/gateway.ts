import { findSettings, insert, remove, update } from '#/db/settings'
import { Omit } from 'shared/types'

export interface IGatewayEntity {
    key: 'gateway'
    name: string
    hostname: string
    identity: string
    psk: string
}

export const getGateway: () => IGatewayEntity | null = () =>
    findSettings('gateway')

export const insertGateway = (gateway: Omit<IGatewayEntity, 'key'>) =>
    insert('gateway', gateway)

export const updateGateway = ({ name, hostname }: Partial<Omit<IGatewayEntity, 'key'>>) => {
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
