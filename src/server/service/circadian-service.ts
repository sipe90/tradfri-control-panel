import R from 'ramda'

import * as circadianUpdater from '#/component/circadian-updater'
import * as db from '#/db/circadian'
import { ValidationError } from '#/error'
import logger from '#/logger'
import {
    getConnection, isGatewayConnected
} from '#/service/gateway-connection-manager'
import { ICircadianSettings, IUpdateCircadianSettingsRequest } from 'shared/types'

const locDecimals = 2

export const getCircadianSettings = async (): Promise<Readonly<ICircadianSettings> | null> => db.getCircadianSettings()

export const updateCircadianSettings = async (circadianSettings: IUpdateCircadianSettingsRequest) => {
    const { latitude, longitude } = circadianSettings

    if (!isGatewayConnected()) {
        throw new Error('Could not update circadian settings: Not connected to gateway')
    }

    if (!latitude) {
        throw new ValidationError('latitude', 'Latitude is required')
    }
    if (!longitude) {
        throw new ValidationError('longitude', 'Longitude is required')
    }

    const parsedLatitude = parseFloat(latitude)
    if (Number.isNaN(parsedLatitude)) {
        throw new ValidationError('latitude', 'Latitude value is invalid')
    }
    if (parsedLatitude < 90 || parsedLatitude > 90) {
        throw new ValidationError('latitude', 'Latitude value range is [-90, 90]')
    }

    const parsedLongitude = parseFloat(longitude)
    if (Number.isNaN(parsedLongitude)) {
        throw new ValidationError('longitude', 'Longitude value is invalid')
    }
    if (parsedLongitude < -180 || parsedLongitude > 180) {
        throw new ValidationError('longitude', 'Longitude value range is [-90, 90]')
    }

    const fixedLatitude = parsedLatitude.toFixed(locDecimals)
    const fixedLongitude = parsedLongitude.toFixed(locDecimals)

    const currentSettings = await getCircadianSettings()

    db.setCircadianSettings({
        ...(currentSettings ? currentSettings : { groupIds: [] }),
        latitude: fixedLatitude,
        longitude: fixedLongitude
    })
    circadianUpdater.update()
}

export const addGroup = async (groupId: string) => {
    const gatewayGroups = R.keys(getConnection().getGroups())
    if (!gatewayGroups.includes(groupId)) {
        throw new Error(`Cannot add group: Invalid group id: ${groupId}`)
    }
    const currentSettings = await getCircadianSettings()
    if (!currentSettings) {
        throw new Error('Could not add group: Circadian settings are not set')
    }
    if (currentSettings.groupIds.includes(groupId)) {
        throw new Error('Could not add group: Group is already added to settings')
    }
    db.setCircadianSettings({
        ...currentSettings,
        groupIds: currentSettings.groupIds.concat(groupId)
    })
    logger.info(`Group id ${groupId} added to settings`)
    circadianUpdater.update()
}

export const removeGroup = async (groupId: string) => {
    const currentSettings = await getCircadianSettings()
    if (!currentSettings) {
        throw new Error('Could not remove group: Circadian settings are not set')
    }
    if (!currentSettings.groupIds.includes(groupId)) {
        throw new Error('Could not remove group: Group has not found from settings')
    }
    db.setCircadianSettings({
        ...currentSettings,
        groupIds: currentSettings.groupIds.filter((id) => id !== groupId)
    })
    logger.info(`Group id ${groupId} removed from settings`)
    circadianUpdater.update()
}

export const setupCircadian = async () => {
    const circadianSettings = await getCircadianSettings()
    if (!circadianSettings) {
        logger.info('Circadian settings were not set, skipping setup')
        return
    }
    const { groupIds } = circadianSettings as db.ICircadianEntity
    if (!groupIds.length) {
        logger.info('No groups enabled for circadian, skipping setup')
        return
    }
    circadianUpdater.update()
}
