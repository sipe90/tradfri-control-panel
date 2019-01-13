import { findSettings, insert, update } from '#/db/settings'
import { Omit } from 'shared/types'

export interface IFluxEntity {
    key: 'flux'
    enabled: boolean
    latitude: string
    longitude: string
    groupIds: string[]
}

export const getFluxSettings: () => IFluxEntity | null = () =>
    findSettings('flux')

export const setFluxSettings = (fluxSettings: Omit<IFluxEntity, 'key'>) => {
    const currentSettings = getFluxSettings()
    if (!currentSettings) {
        insert('flux', fluxSettings)
    } else {
        currentSettings.enabled = fluxSettings.enabled
        currentSettings.groupIds = fluxSettings.groupIds
        currentSettings.latitude = fluxSettings.latitude
        currentSettings.longitude = fluxSettings.longitude

        update(currentSettings)
    }
}
