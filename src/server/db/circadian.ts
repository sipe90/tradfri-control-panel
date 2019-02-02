import { findSettings, insert, update } from '#/db/settings'
import { Omit } from 'shared/types'

export interface ICircadianEntity {
    key: 'circadian'
    latitude: string
    longitude: string
    groupIds: string[]
}

export const getCircadianSettings: () => Readonly<ICircadianEntity> | null = () =>
    findSettings('circadian')

export const setCircadianSettings = (circadianSettings: Omit<ICircadianEntity, 'key'>) => {
    const currentSettings = findSettings('circadian')
    if (!currentSettings) {
        insert('circadian', circadianSettings)
    } else {
        currentSettings.groupIds = circadianSettings.groupIds
        currentSettings.latitude = circadianSettings.latitude
        currentSettings.longitude = circadianSettings.longitude

        update(currentSettings)
    }
}
