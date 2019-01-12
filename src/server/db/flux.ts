import { transactional } from '#/db'
import { getBooleanSettingValue, getSettingValue, setBooleanSettingValue, setSettingValue } from '#/db/settings'
import { Nullable } from 'shared/types'

export interface IFluxEntity {
    enabled: boolean
    latitude: string
    longitude: string
    groupIds: string[]
}

const KEY_FLUX_ENABLED = 'flux.enabled'
const KEY_FLUX_LATITUDE = 'flux.latitude'
const KEY_FLUX_LONGITUDE = 'flux.longitude'
const KEY_FLUX_GROUPS = 'flux.groups'

export const getFluxSettings: () => Promise<Nullable<IFluxEntity>> = async () => ({
    enabled: await getFluxEnabled(),
    latitude: await getSettingValue(KEY_FLUX_LATITUDE),
    longitude: await getSettingValue(KEY_FLUX_LONGITUDE),
    groupIds: await getFluxGroups()
})

export const setFluxSettings = async ({ enabled, latitude, longitude, groupIds }: IFluxEntity) =>
    transactional(async () => {
        setBooleanSettingValue(KEY_FLUX_ENABLED, enabled)
        setSettingValue(KEY_FLUX_LATITUDE, latitude)
        setSettingValue(KEY_FLUX_LONGITUDE, longitude)
        setSettingValue(KEY_FLUX_GROUPS, groupIds.join(','))
    })

export const getFluxEnabled = () => getBooleanSettingValue(KEY_FLUX_ENABLED)

export const getFluxGroups = async () => {
    const groupsStr = await getSettingValue(KEY_FLUX_GROUPS)
    return groupsStr ? groupsStr.split(',') : null
}
