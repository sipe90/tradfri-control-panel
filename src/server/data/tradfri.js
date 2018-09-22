const R = require('ramda')

const normalizeDevices = (lights, sensors) => ({
    lights: R.map((instanceId) => parseInt(instanceId, 10), R.keys(lights)),
    sensors: R.map((instanceId) => parseInt(instanceId, 10), R.keys(sensors)),
})

const normalizeLights = (lights) => R.map(normalizeLight, R.values(lights))

const normalizeSensors = (sensors) => R.map(normalizeSensor, R.values(sensors))

const normalizeGroups = (groups) => R.map(normalizeGroup, R.values(groups))

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
    brightness: R.path(['lightList', 0, 'dimmer'], light),
    spectrum: R.path(['lightList', 0, 'spectrum'], light),
    dimmable: R.path(['lightList', 0, 'isDimmable'], light),
    switchable: R.path(['lightList', 0, 'isSwitchable'], light),
    on: R.path(['lightList', 0, 'onOff'], light),
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

const normalizeGroup = ({ group, scenes }) => ({
    id: group.instanceId,
    name: group.name,
    devices: group.deviceIDs,
    moods: R.map(normalizeScene, R.values(scenes)),
})

const normalizeScene = (scene) => ({
    id: scene.instanceId,
    name: scene.name,
    active: scene.isActive
})

module.exports = {
    normalizeDevices,
    normalizeLights,
    normalizeSensors,
    normalizeGroups
}
