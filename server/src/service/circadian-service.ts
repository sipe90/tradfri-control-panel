import R from 'ramda'

import CircadianUpdater from '#/component/CircadianUpdater'
import * as db from '#/db/circadian'
import { ValidationError } from '#/error'
import logger from '#/logger'
import {
    getConnection, isGatewayConnected
} from '#/service/gateway-connection-manager'
import { Accessory, Group } from 'node-tradfri-client'
import { CircadianSettings, UpdateCircadianSettingsRequest } from '@tradfri-control-panel/shared'

const locDecimals = 3

let updater: CircadianUpdater | null

export const getCircadianSettings = async (): Promise<Readonly<CircadianSettings> | null> => db.getCircadianSettings()

export const updateCircadianSettings = async (circadianSettings: UpdateCircadianSettingsRequest) => {
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
    if (parsedLatitude < -90 || parsedLatitude > 90) {
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

    const currentSettings = db.getCircadianSettings()

    db.setCircadianSettings({
        ...(currentSettings || { groupIds: [] }),
        latitude: fixedLatitude,
        longitude: fixedLongitude
    })
    updateCicadian()
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
    updateCicadian()
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
    updateCicadian()
}

const updateCicadian = () => {
    const settings = db.getCircadianSettings()
    if (!settings) {
        logger.info('Circadian settings were not set')
        return
    }
    const { latitude, longitude, groupIds } = settings
    if (!groupIds.length) {
        logger.info('No groups enabled for circadian')
        if (updater && updater.isRunning()) {
            logger.info('Stopping circadian updater')
            updater.stop()
        }
        return
    }

    const parsedLatitude = parseFloat(latitude)
    const parsedLongitude = parseFloat(longitude)

    if (!updater) {
        updater = new CircadianUpdater(parsedLatitude, parsedLongitude)
        updater.start(updateLights)
    } else {
        updater.setLatitude(parsedLatitude)
        updater.setLongitude(parsedLongitude)
        if (!updater.isRunning()) {
            updater.start(updateLights)
        }
    }
}

const updateLights = (temperature: number) => {

    const settings = db.getCircadianSettings()
    if (!settings) {
        logger.error('Circadian were not found during light temperature update!')
        return
    }

    const { groupIds } = settings

    logger.info('Setting color temperature of all lights in groups [%s] to %d%',
        groupIds.join(', '), temperature)

    const connection = getConnection()
    const groups = connection.getGroups()
    const lights = connection.getLights()

    for (const groupId of groupIds) {
        const groupInfo = groups[groupId]
        if (!groupInfo) {
            logger.error(`Circadian settings contained an unknown group id: ${groupId}`)
            continue
        }
        const groupLightIds = getLightsForGroup(groupInfo.group, lights)
        for (const lightId of groupLightIds) {
            connection.operateLight(lightId, { colorTemperature: temperature })
        }
    }
}

const getLightsForGroup = (group: Group, lights: Record<string, Accessory>) =>
    R.keys(R.pick(R.map(String, group.deviceIDs), lights))

export const setupCircadian = updateCicadian
