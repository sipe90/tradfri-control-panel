import R from 'ramda'
import sunCalc from 'suncalc'

import * as db from '#/db/flux'
import { ValidationError } from '#/error'
import logger from '#/logger'
import {
    getConnection, isGatewayConnected
} from '#/service/gateway-connection-manager'
import { isAnyValueNil } from '#/utils'
import { Accessory, Group } from 'node-tradfri-client'
import { IUpdateFluxSettingsRequest } from 'shared/types'

let intervalHandle: number | null = null

export const isFluxEnabled = db.getFluxEnabled

export const getFluxSettings = db.getFluxSettings

export const updateFluxSettings = async (fluxSettings: IUpdateFluxSettingsRequest) => {
    const { enabled, latitude, longitude, groupIds } = fluxSettings

    if (!isGatewayConnected()) {
        throw new Error('Could not update flux settings: Not connected to gateway')
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

    const fixedLatitude = parsedLatitude.toFixed(6)
    const fixedLongitude = parsedLongitude.toFixed(6)

    db.setFluxSettings({
        ...fluxSettings,
        latitude: fixedLatitude,
        longitude: fixedLongitude
    })

    if (fluxSettings.enabled) {
        intervalHandle && clearInterval(intervalHandle)
        intervalHandle = setInterval(
            updateLights, 1000 * 60, parseFloat(fixedLatitude), parseFloat(fixedLongitude), groupIds)
    } else if (intervalHandle) {
        clearInterval(intervalHandle)
        intervalHandle = null
    }
}

export const setupFlux = async () => {
    const fluxSettings = await getFluxSettings()
    if (isAnyValueNil(fluxSettings)) {
        logger.info('One or more flux settings were not set, skipping setup')
        return
    }
    const { enabled, latitude, longitude, groupIds } = fluxSettings as db.IFluxEntity
    if (!enabled) {
        logger.info('Flux mode is disabeld, skiping setup')
        return
    }

    const parsedLatitude = parseFloat(latitude)
    const parsedLongitude = parseFloat(longitude)

    updateLights(parsedLatitude, parsedLongitude, groupIds)
    intervalHandle = setInterval(updateLights, 1000 * 60, parsedLatitude, parsedLongitude, groupIds)
}

const updateLights = (latitude: number, longitude: number, groupIds: string[]) => {
    const now = new Date()
    const currentWarmth = getWarmth(now, latitude, longitude)

    logger.info('Setting color temperature of all lights in groups [%s] to %d', groupIds.join(', '), currentWarmth)

    const connection = getConnection()
    const groups = connection.getGroups()
    const lights = connection.getLights()

    for (const groupId of groupIds) {
        const groupInfo = groups[groupId]
        if (!groupInfo) {
            logger.error(`Flux settings contained an unknown group id: ${groupId}`)
            continue
        }
        const groupLightIds = getLightsForGroup(groupInfo.group, lights)
        for (const lightId of groupLightIds) {
            connection.operateLight(lightId, { colorTemperature: currentWarmth })
        }
    }
}

const getWarmth = (date: Date, latitude: number, longitude: number) => {
    const { sunrise, sunset } = sunCalc.getTimes(date, latitude, longitude)

    const time = date.getTime()
    const sunriseTime = sunrise.getTime()
    const sunsetTime = sunset.getTime()

    const warmthAtSunrise = 15
    const warmthAtSunset = 80
    const sunriseStartAdjust = 1000 * 60 * 60 * 2
    const sunsetStartAdjust = 1000 * 60 * 60 * 2

    // Time between 00:00 and sunrise
    if (time < sunriseTime) {
        const timeDifference = sunriseTime - time
        if (timeDifference > sunriseStartAdjust) {
            return warmthAtSunset
        }
        const scaleFactor = timeDifference / sunriseStartAdjust
        return warmthAtSunrise + scaleFactor * (warmthAtSunset - warmthAtSunrise)
    // Time between sunrise and sunset
    } else if (time < sunsetTime) {
        const timeDifference = sunsetTime - time
        if (timeDifference > sunsetStartAdjust) {
            return warmthAtSunrise
        }
        const scaleFactor = (sunsetStartAdjust - timeDifference) / sunsetStartAdjust
        return warmthAtSunrise + scaleFactor * (warmthAtSunset - warmthAtSunrise)
    }
    // Time between sunset and 23:59
    return warmthAtSunset
}

const getLightsForGroup = (group: Group, lights: Record<string, Accessory>) =>
    R.keys(R.pick(R.map(String, group.deviceIDs), lights))
