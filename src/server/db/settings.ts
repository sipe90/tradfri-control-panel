import { del, get, ins, transactional } from '#/db'
import R from 'ramda'
import SQL from 'sql-template-strings'

interface ISettingEntity {
    key: string
    value: string
}

export const getSetting = (key: string) =>
    get<ISettingEntity>(SQL`SELECT key, value FROM setting WHERE key = ${key}`)

export const setSettingValue = (key: string, value: string) =>
    ins(SQL`INSERT OR REPLACE INTO setting (key, value) VALUES (${key}, ${value})`)

export const deleteSetting = (key: string) =>
    del(SQL`DELETE FROM setting WHERE key = ${key}`)

export const getSettingValue = async (key: string) => getValue(await getSetting(key))

export const getBooleanSettingValue = async (key: string) => {
    const valueStr = await getSettingValue(key)
    if (valueStr === 'true') return true
    if (valueStr === 'false') return false
    if (R.isNil(valueStr)) return null
    throw new Error(`Invalid value for key ${key}: ${valueStr}`)
}

export const setBooleanSettingValue = (key: string, value: boolean) =>
    transactional(() => setSettingValue(key, value ? 'true' : 'false'))

const getValue = (setting?: ISettingEntity) =>
    R.propOr<null, ISettingEntity | undefined, string | null>(null, 'value', setting)
