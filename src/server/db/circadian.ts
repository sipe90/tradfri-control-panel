import R from 'ramda'

import { findSettings, insert, update } from '#/db/settings'
import { nullIfEmpty } from '#/utils'
import { ICircadianSettings } from 'shared/types'

export interface ICircadianEntity {
    key: 'circadian'
    latitude: string
    longitude: string
    groupIds: string[]
}

export const getCircadianSettings: () => Readonly<ICircadianSettings> | null = () =>
    nullIfEmpty(R.omit<ICircadianEntity, 'key'>(['key'], findSettings('circadian')))

export const setCircadianSettings = (circadianSettings: ICircadianSettings) => {
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
