import R from 'ramda'
import sunCalc from 'suncalc'

import * as db from '#/db/circadian'
import { ValidationError } from '#/error'
import logger from '#/logger'
import {
    getConnection, isGatewayConnected
} from '#/service/gateway-connection-manager'
import { Accessory, Group } from 'node-tradfri-client'
import { ICircadianSettings, IUpdateCircadianSettingsRequest } from 'shared/types'

const updateInterval = 1000 * 60
const locDecimals = 2
const warmthAtSunrise = 15
const warmthAtSunset = 80
const sunriseAdjustTime = 1000 * 60 * 60 * 2
const sunsetAdjustTime = 1000 * 60 * 60 * 2

let intervalHandle: number | null = null

export const isCircadianEnabled = () => {
    const circadianSettings = db.getCircadianSettings()
    if (!circadianSettings) return false
    return circadianSettings.enabled
}

export const getCircadianSettings = (): ICircadianSettings | null => db.getCircadianSettings()

export const updateCircadianSettings = async (circadianSettings: IUpdateCircadianSettingsRequest) => {
    const { enabled, latitude, longitude, groupIds } = circadianSettings

    if (!isGatewayConnected()) {
        throw new Error('Could not update circadian settings: Not connected to gateway')
    }

    if (R.isNil(enabled)) {
        throw new ValidationError('enabled', 'Enabled is required')
    }
    if (!latitude) {
        throw new ValidationError('latitude', 'Latitude is required')
    }
    if (!longitude) {
        throw new ValidationError('longitude', 'Longitude is required')
    }
    if (R.isNil(groupIds) && R.isEmpty(groupIds)) {
        throw new ValidationError('groupIds', 'Groups are required')
    }

    const parsedLatitude = parseFloat(latitude)
    if (R.isNaN(parsedLatitude)) {
        throw new ValidationError('latitude', 'Latitude value is invalid')
    }
    if (parsedLatitude < 90 || parsedLatitude > 90) {
        throw new ValidationError('latitude', 'Latitude value range is [-90, 90]')
    }

    const parsedLongitude = parseFloat(longitude)
    if (R.isNaN(parsedLongitude)) {
        throw new ValidationError('longitude', 'Longitude value is invalid')
    }
    if (parsedLongitude < -180 || parsedLongitude > 180) {
        throw new ValidationError('longitude', 'Longitude value range is [-90, 90]')
    }

    const gatewayGroups = getConnection().getGroups()
    const invalidGroupIds = R.difference(groupIds, R.keys(gatewayGroups))
    if (invalidGroupIds.length) {
        throw new ValidationError('groups', `One or more invalid groups ids given: ${invalidGroupIds.join(', ')}`)
    }

    const fixedLatitude = parsedLatitude.toFixed(locDecimals)
    const fixedLongitude = parsedLongitude.toFixed(locDecimals)

    db.setCircadianSettings({
        ...circadianSettings,
        latitude: fixedLatitude,
        longitude: fixedLongitude
    })

    if (circadianSettings.enabled) {
        intervalHandle && clearInterval(intervalHandle)
        updateLights(parsedLatitude, parsedLongitude, groupIds)
        intervalHandle = setInterval(
            updateLights, updateInterval, parseFloat(fixedLatitude), parseFloat(fixedLongitude), groupIds)
    } else if (intervalHandle) {
        clearInterval(intervalHandle)
        intervalHandle = null
    }
}

export const setupCircadian = async () => {
    const circadianSettings = await getCircadianSettings()
    if (!circadianSettings) {
        logger.info('Circadian settings were not set, skipping setup')
        return
    }
    const { enabled, latitude, longitude, groupIds } = circadianSettings as db.ICircadianEntity
    if (!enabled) {
        logger.info('Circadian mode is disabeld, skipping setup')
        return
    }

    const parsedLatitude = parseFloat(latitude)
    const parsedLongitude = parseFloat(longitude)

    updateLights(parsedLatitude, parsedLongitude, groupIds)
    intervalHandle = setInterval(updateLights, updateInterval, parsedLatitude, parsedLongitude, groupIds)

    logger.info('Circadian setup finished. Updating lights with %dms interval', updateInterval)
}

const updateLights = (latitude: number, longitude: number, groupIds: string[]) => {
    const now = new Date()
    const currentTemp = getTemperature(now, latitude, longitude)

    logger.info('Setting color temperature of all lights in groups [%s] to %d%',
        groupIds.join(', '), currentTemp)

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
            connection.operateLight(lightId, { colorTemperature: currentTemp })
        }
    }
}

const getTemperature = (date: Date, latitude: number, longitude: number) => {
    const { sunrise, sunset } = sunCalc.getTimes(date, latitude, longitude)

    const time = date.getTime()
    const sunriseTime = sunrise.getTime()
    const sunsetTime = sunset.getTime()

    logger.debug('Configured location is %f lat, %f lon', latitude, longitude)
    logger.debug('Sunrise temperature adjust timeframe is %d minutes', sunriseAdjustTime / (60 * 1000))
    logger.debug('Sunset temperature adjust timeframe is %d minutes', sunsetAdjustTime / (60 * 1000))
    logger.debug('Sun rises today at %s', sunrise.toTimeString())
    logger.debug('Sun sets today at %s', sunset.toTimeString())

    // Time between 00:00 and sunrise
    if (time < sunriseTime) {
        const timeDifference = sunriseTime - time
        if (timeDifference > sunriseAdjustTime) {
            return warmthAtSunset
        }
        const scaleFactor = timeDifference / sunriseAdjustTime
        return warmthAtSunrise + scaleFactor * (warmthAtSunset - warmthAtSunrise)
    // Time between sunrise and sunset
    } else if (time < sunsetTime) {
        const timeDifference = sunsetTime - time
        if (timeDifference > sunsetAdjustTime) {
            return warmthAtSunrise
        }
        const scaleFactor = (sunsetAdjustTime - timeDifference) / sunsetAdjustTime
        return warmthAtSunrise + scaleFactor * (warmthAtSunset - warmthAtSunrise)
    }
    // Time between sunset and 23:59
    return warmthAtSunset
}

const getLightsForGroup = (group: Group, lights: Record<string, Accessory>) =>
    R.keys(R.pick(R.map(String, group.deviceIDs), lights))
