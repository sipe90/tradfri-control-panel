import { findSettings, insert, update } from '#/db/settings'
import { Omit } from 'shared/types'

export interface ICircadianEntity {
    key: 'circadian'
    enabled: boolean
    latitude: string
    longitude: string
    groupIds: string[]
}

export const getCircadianSettings: () => ICircadianEntity | null = () =>
    findSettings('circadian')

export const setCircadianSettings = (circadianSettings: Omit<ICircadianEntity, 'key'>) => {
    const currentSettings = getCircadianSettings()
    if (!currentSettings) {
        insert('circadian', circadianSettings)
    } else {
        currentSettings.enabled = circadianSettings.enabled
        currentSettings.groupIds = circadianSettings.groupIds
        currentSettings.latitude = circadianSettings.latitude
        currentSettings.longitude = circadianSettings.longitude

        update(currentSettings)
    }
}
