const R = require('ramda')

const normalize = (gateway) => normalizeDevices(gateway.getLights(), gateway.getSensors())

const normalizeDevices = (lights, sensors) => ({
    lights: R.map(
        (light) => ({
            id: light.instanceId,
            name: light.name,
            alive: light.alive,
            manufacturer: light.deviceInfo.manufacturer,
            model: light.deviceInfo.modelNumber,
            power: light.deviceInfo.power,
            battery: light.deviceInfo.battery,
            color: R.path(['lightList', 0, 'color'], light),
            colorTemperature: R.path(['lightList', 0, 'colorTemperature'], light),
            brightness:  R.path(['lightList', 0, 'dimmer'], light),
            spectrum:  R.path(['lightList', 0, 'spectrum'], light),
            dimmable:  R.path(['lightList', 0, 'isDimmable'], light),
            switchable:  R.path(['lightList', 0, 'isSwitchable'], light),
            on:  R.path(['lightList', 0, 'onOff'], light),
        }),
        lights
    ),
    sensors: R.map(
        (sensor) => ({
            id: sensor.instanceId,
            name: sensor.name,
            alive: sensor.alive,
            manufacturer: sensor.deviceInfo.manufacturer,
            model: sensor.deviceInfo.modelNumber,
            power: sensor.deviceInfo.power,
            battery: sensor.deviceInfo.battery
        }),
        sensors
    )
})

module.exports = {
    normalize
}
