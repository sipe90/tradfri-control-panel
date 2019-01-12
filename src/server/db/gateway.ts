import { transactional } from '#/db'
import { deleteSetting, getSettingValue, setSettingValue } from '#/db/settings'
import { Nullable } from 'shared/types'

export interface IGatewayEntity {
    name: string
    hostname: string
    identity: string
    psk: string
}

const KEY_GATEWAY_NAME = 'gateway.name'
const KEY_GATEWAY_HOSTNAME = 'gateway.hostname'
const KEY_GATEWAY_IDENTITY = 'gateway.identity'
const KEY_GATEWAY_PSK = 'gateway.psk'

export const getGateway: () => Promise<Nullable<IGatewayEntity>> = async () => ({
    name: await getSettingValue(KEY_GATEWAY_NAME),
    hostname: await getSettingValue(KEY_GATEWAY_HOSTNAME),
    identity: await getSettingValue(KEY_GATEWAY_IDENTITY),
    psk: await getSettingValue(KEY_GATEWAY_PSK)
})

export const insertGateway = ({ name, hostname, identity, psk }: IGatewayEntity) =>
    transactional(async () => {
        setSettingValue(KEY_GATEWAY_NAME, name)
        setSettingValue(KEY_GATEWAY_HOSTNAME, hostname)
        setSettingValue(KEY_GATEWAY_IDENTITY, identity)
        setSettingValue(KEY_GATEWAY_PSK, psk)
    })

export const updateGateway = ({ name, hostname }: Partial<IGatewayEntity>) =>
    transactional(async () => {
        name && await setSettingValue(KEY_GATEWAY_NAME, name)
        hostname && await setSettingValue(KEY_GATEWAY_HOSTNAME, hostname)
    })

export const deleteGateway = () =>
    transactional(async () =>
        await deleteSetting(KEY_GATEWAY_NAME) &&
        await deleteSetting(KEY_GATEWAY_HOSTNAME) &&
        await deleteSetting(KEY_GATEWAY_IDENTITY) &&
        await deleteSetting(KEY_GATEWAY_PSK)
    )
