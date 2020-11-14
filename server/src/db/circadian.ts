import R from 'ramda'

import { findSettings, insert, update } from '#/db/settings'
import { nullIfEmpty } from '#/utils'
import { CircadianSettings } from 'shared'

export interface CircadianEntity {
    key: 'circadian'
    latitude: string
    longitude: string
    groupIds: string[]
}

export const getCircadianSettings: () => Readonly<CircadianSettings> | null = () =>
    nullIfEmpty(R.omit<CircadianEntity, 'key'>(['key'], findSettings('circadian')))

export const setCircadianSettings = (circadianSettings: CircadianSettings) => {
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
