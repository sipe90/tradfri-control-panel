import { Accessory, Group } from 'node-tradfri-client'
import R from 'ramda'
import sunCalc from 'suncalc'

import * as db from '#/db/circadian'
import logger from '#/logger'
import { getConnection } from '#/service/gateway-connection-manager'

const updateInterval = 1000 * 60 * 10

const warmthAtSunrise = 15
const warmthAtSunset = 80
const sunriseAdjustTime = 1000 * 60 * 60 * 2
const sunsetAdjustTime = 1000 * 60 * 60 * 2

let intervalHandle: number | null = null

export const update = () => {
    const settings = db.getCircadianSettings()
    if (!settings) {
        logger.warn('Circadian settings not found, doing nothing')
        return
    }

    const { latitude, longitude, groupIds } = settings
    const parsedLatitude = parseFloat(latitude)
    const parsedLongitude = parseFloat(longitude)

    if (groupIds && groupIds.length) {
        if (!intervalHandle) {
            logger.info('Setting up circadian light updates. Updating lights with %d minute interval',
                updateInterval / 60000)
        } else {
            clearInterval(intervalHandle)
        }

        updateLights(parsedLatitude, parsedLongitude, groupIds)
        intervalHandle = setInterval(
            updateLights, updateInterval, parsedLatitude, parsedLongitude, groupIds)

    } else if (intervalHandle) {
        logger.info('No more groups present in circadian settings, disabling light updates')
        clearInterval(intervalHandle)
        intervalHandle = null
    } else {
        logger.info('No groups present in circadian settings, nothing was done')
    }
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
