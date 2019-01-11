import { all, del, get, ins, transactional } from '#/db'
import R from 'ramda'
import SQL from 'sql-template-strings'

interface ISettingEntity {
    key: string
    value: string
}

interface IGatewayEntity {
    name: string
    hostname: string
    identity: string
    psk: string
}

export const KEY_GATEWAY_NAME = 'gateway.name'
export const KEY_GATEWAY_HOSTNAME = 'gateway.hostname'
export const KEY_GATEWAY_IDENTITY = 'gateway.identity'
export const KEY_GATEWAY_PSK = 'gateway.psk'

export const getAllSettings = async () =>
    get<ISettingEntity>(SQL`SELECT key, value FROM setting`)

export const getSetting = async (key: string) =>
    get<ISettingEntity>(SQL`SELECT key, value FROM setting WHERE key = ${key}`)

export const setSetting = async ({ key, value }: ISettingEntity) =>
    ins(SQL`INSERT OR REPLACE INTO setting (key, value) VALUES (${key}, ${value})`)

export const deleteSetting = async (key: string) =>
    del(SQL`DELETE FROM setting WHERE key = ${key}`)

const findByKey = (key: string, settings: ISettingEntity[]) =>
    R.propOr<null, ISettingEntity | undefined, string>(null, 'value', R.find(R.propEq('key', key), settings))

export const selectGateway: () => Promise<IGatewayEntity | null> = async () => {
    const gatewaySettings = await all<ISettingEntity>(SQL`SELECT key, value FROM setting WHERE key LIKE 'gateway.%'`)
    const name = findByKey(KEY_GATEWAY_NAME, gatewaySettings)
    const hostname = findByKey(KEY_GATEWAY_HOSTNAME, gatewaySettings)
    const identity = findByKey(KEY_GATEWAY_IDENTITY, gatewaySettings)
    const psk = findByKey(KEY_GATEWAY_PSK, gatewaySettings)
    if (!name || !hostname || !identity || !psk) return null
    return {
        name,
        hostname,
        identity,
        psk
    }
}

export const insertGateway = async ({ name, hostname, identity, psk }: IGatewayEntity) =>
    transactional(async () => {
        await setSetting({ key: KEY_GATEWAY_NAME, value: name})
        await setSetting({ key: KEY_GATEWAY_HOSTNAME, value: hostname})
        await setSetting({ key: KEY_GATEWAY_IDENTITY, value: identity})
        await setSetting({ key: KEY_GATEWAY_PSK, value: psk})
    })

export const updateGateway = async ({ name, hostname }: Partial<IGatewayEntity>) =>
    transactional(async () => {
        name && await setSetting({ key: KEY_GATEWAY_NAME, value: name})
        hostname && await setSetting({ key: KEY_GATEWAY_HOSTNAME, value: hostname})
    })

export const deleteGateway = async () =>
    transactional(async () =>
        await deleteSetting(KEY_GATEWAY_NAME) &&
        await deleteSetting(KEY_GATEWAY_HOSTNAME) &&
        await deleteSetting(KEY_GATEWAY_IDENTITY) &&
        await deleteSetting(KEY_GATEWAY_PSK)
    )
