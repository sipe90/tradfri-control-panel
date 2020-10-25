import R from 'ramda'
import sunCalc from 'suncalc'

import logger from '#/logger'

interface ICircadianOptions {
    warmthAtSunrise: number
    warmthAtSunset: number
    sunriseAdjustTime: number
    sunsetAdjustTime: number
}

type UpdateCallback = (temperature: number) => void

export const defaultOptions: Readonly<ICircadianOptions> = {
    warmthAtSunrise: 15,
    warmthAtSunset: 80,
    sunriseAdjustTime: 1000 * 60 * 60 * 2,
    sunsetAdjustTime: 1000 * 60 * 60 * 2
}

const defaultUpdateInterval = 1000 * 60 * 10

export default class CircadianUpdater {

    private latitude: number
    private longitude: number
    private updateInterval: number
    private options: ICircadianOptions

    private intervalHandle: NodeJS.Timeout | null = null

    constructor(
        latitude: number,
        longitude: number,
        updateInterval = defaultUpdateInterval,
        options: Partial<ICircadianOptions> = {}
    ) {
        this.latitude = latitude
        this.longitude = longitude
        this.updateInterval = updateInterval
        this.options = R.merge(defaultOptions, options)
    }

    public start = (callback: UpdateCallback) => {
        if (this.intervalHandle) {
            return
        }
        logger.info('Setting up circadian light updates. Updating with %d minute interval',
            this.updateInterval / 60000)

        this.update(callback)
        this.intervalHandle = setInterval(this.update, this.updateInterval, callback)
    }

    public stop = () => {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle)
            this.intervalHandle = null
        }
    }

    public isRunning = () => {
        return this.intervalHandle !== null
    }

    public setLatitude = (latitude: number) => {
        this.latitude = latitude
    }

    public setLongitude = (longitude: number) => {
        this.longitude = longitude
    }

    private update = (callback: UpdateCallback) => {
        const now = new Date()
        const currentTemp = calculateTemperature(now, this.latitude, this.longitude, this.options)
        const roundedTemp = Math.round(currentTemp)

        callback(roundedTemp)
    }
}

export const calculateTemperature = (date: Date, latitude: number, longitude: number, options: ICircadianOptions) => {
    const { warmthAtSunrise, warmthAtSunset, sunriseAdjustTime, sunsetAdjustTime } = options
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
