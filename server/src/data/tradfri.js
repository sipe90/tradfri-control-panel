const R = require('ramda')

const normalizeGateway = (gateway) => ({
    lights: R.map(R.prop('instanceId'), gateway.getLights()),
    sensors: R.map(R.prop('instanceId'), gateway.getSensors()),
})

const normalizeLights = (gateway) => R.map(normalizeLight, gateway.getLights())

const normalizeSensors = (gateway) => R.map(normalizeSensor, gateway.getSensors())

const normalizeLight = (light) => ({
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
})

const normalizeSensor = (sensor) => ({
    id: sensor.instanceId,
    name: sensor.name,
    alive: sensor.alive,
    manufacturer: sensor.deviceInfo.manufacturer,
    model: sensor.deviceInfo.modelNumber,
    power: sensor.deviceInfo.power,
    battery: sensor.deviceInfo.battery
})

module.exports = {
    normalizeGateway,
    normalizeLights,
    normalizeSensors
}
