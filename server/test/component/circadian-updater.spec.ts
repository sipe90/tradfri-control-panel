import { calculateTemperature, defaultOptions } from '#/component/CircadianUpdater'

describe('Circadian updater', () => {

    // Sunrise 08:01:00.389+03:00, sunset 18:13:20.080+03:00 @ Helsinki 15.10.2017
    const latitude = 60.170
    const longitude = 24.935

    describe('Calculate temperature', () => {

        it('Should calculate correct temperature at sunrise', () => {

            const options = defaultOptions
            const time = new Date('2017-10-15T08:01:00.389+03:00')

            const result = calculateTemperature(time, latitude, longitude, options)

            expect(result).toBeCloseTo(options.warmthAtSunrise)
        })

        it('Should calculate correct temperature at sunset', () => {

            const options = defaultOptions
            const time = new Date('2017-10-15T18:13:20.080+03:00')

            const result = calculateTemperature(time, latitude, longitude, options)

            expect(result).toBeCloseTo(options.warmthAtSunset)
        })

        it('Should calculate correct temperature between sunset and sunrise', () => {

            const options = defaultOptions
            const time = new Date('2017-10-15T23:00:00+03:00')

            const result = calculateTemperature(time, latitude, longitude, options)

            expect(result).toBeCloseTo(options.warmthAtSunset)
        })

        it('Should calculate correct temperature at the beginning of sunrise adjust time', () => {

            const options = defaultOptions
            const time = new Date('2017-10-15T06:01:00.389+03:00')

            const result = calculateTemperature(time, latitude, longitude, options)

            expect(result).toBeCloseTo(options.warmthAtSunset)
        })

        it('Should calculate correct temperature in the middle of sunrise adjust time', () => {

            const options = defaultOptions
            const time = new Date('2017-10-15T07:01:00.389+03:00')

            const result = calculateTemperature(time, latitude, longitude, options)

            expect(result).toBeCloseTo(47.5)
        })

        it('Should calculate correct temperature at the beginning of sunset adjust time', () => {

            const options = defaultOptions
            const time = new Date('2017-10-15T16:13:20.080+03:00')

            const result = calculateTemperature(time, latitude, longitude, options)

            expect(result).toBeCloseTo(options.warmthAtSunrise)
        })

        it('Should calculate correct temperature in the middle of senset adjust time', () => {

            const options = defaultOptions
            const time = new Date('2017-10-15T17:13:20.080+03:00')

            const result = calculateTemperature(time, latitude, longitude, options)

            expect(result).toBeCloseTo(47.5)
        })

    })
})
