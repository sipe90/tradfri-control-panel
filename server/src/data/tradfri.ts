import { Accessory, GroupInfo, Light as TLight, Scene as TScene, LightSetting as TLightSetting } from 'node-tradfri-client'
import R from 'ramda'

import { Gateway, GatewayDevices, Group, Light, Scene, Sensor, LightSetting } from 'shared'

type DeviceRecord = Record<string, Accessory>
type GroupRecord = Record<string, GroupInfo>

const parseId = (instanceId: string) => parseInt(instanceId, 10)

export const normalizeGateway = (
    gateway: Gateway,
    lights: DeviceRecord,
    sensors: DeviceRecord,
    groups: GroupRecord
): GatewayDevices => ({
    ...gateway,
    lights: R.map(parseId, R.keys(lights)),
    sensors: R.map(parseId, R.keys(sensors)),
    groups: R.map(parseId, R.keys(groups))
})

export const normalizeLights = (lights: DeviceRecord) => R.map(normalizeLight, R.values(lights))

export const normalizeSensors = (sensors: DeviceRecord) => R.map(normalizeSensor, R.values(sensors))

export const normalizeGroups = (groups: GroupRecord) => R.map(normalizeGroup, R.values(groups))

const lightProp = (prop: keyof TLight, light: Accessory) => R.pathOr(null, ['lightList', 0, prop], light)

const normalizeLight = (light: Accessory): Light => ({
    id: light.instanceId,
    name: light.name,
    alive: light.alive,
    manufacturer: light.deviceInfo.manufacturer,
    model: light.deviceInfo.modelNumber,
    power: light.deviceInfo.power,
    battery: light.deviceInfo.battery,
    color: lightProp('color', light),
    saturation: lightProp('saturation', light),
    colorTemperature: lightProp('colorTemperature', light),
    brightness: lightProp('dimmer', light),
    spectrum: lightProp('spectrum', light),
    dimmable: lightProp('isDimmable', light),
    switchable: lightProp('isSwitchable', light),
    on: lightProp('onOff', light)
})

const normalizeSensor = (sensor: Accessory): Sensor => ({
    id: sensor.instanceId,
    name: sensor.name,
    alive: sensor.alive,
    manufacturer: sensor.deviceInfo.manufacturer,
    model: sensor.deviceInfo.modelNumber,
    power: sensor.deviceInfo.power,
    battery: sensor.deviceInfo.battery
})

const normalizeGroup = ({ group, scenes }: GroupInfo): Group => ({
    id: group.instanceId,
    default: group.name == "TRADFRI group",
    name: group.name,
    devices: group.deviceIDs,
    moods: R.map(normalizeScene, R.values(scenes)),
})

const normalizeScene = (scene: TScene): Scene => ({
    id: scene.instanceId,
    name: scene.name,
    active: scene.isActive,
    predefined: scene.isPredefined,
    lightSettings: R.map(normalizeLightSetting, scene.lightSettings)
})

const normalizeLightSetting = (lightSetting: TLightSetting): LightSetting => ({
    id: lightSetting.instanceId,
    color: lightSetting.color,
    saturation: lightSetting.saturation,
    colorTemperature: lightSetting.saturation,
    brightness: lightSetting.dimmer,
    on: lightSetting.onOff,
    hue: lightSetting.hue
})
