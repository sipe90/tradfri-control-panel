import R from 'ramda'
import { Accessory, GroupInfo, Scene as TScene, Light as TLight } from 'node-tradfri-client';

interface Device {
    id: number;
    name: string;
    alive: boolean;
    manufacturer: string;
    model: string;
    power: number;
    battery: number;
}

export interface Gateway {
    id: number;
    connected: boolean;
    name: string;
    hostname: string;
    identity: string;
    psk: string;
} 

export interface GatewayDevices extends Gateway {
    lights: number[],
    sensors: number[],
    groups: number[]
} 

export interface Light extends Device {
    color: string;
    colorTemperature: number;
    brightness: number;
    spectrum: number;
    dimmable: boolean;
    switchable: boolean;
    on: boolean;
} 

export interface Sensor extends Device {}

export interface Group {
    id: number;
    name: string;
    devices: number[];
    moods: Scene[];
}

export interface Scene {
    id: number;
    name: string;
    active: boolean;
}

export interface DeviceIDs {
    lights: number[];
    sensors: number[];
    groups: number[];
}

type DeviceRecord = Record<string, Accessory>
type GroupRecord = Record<string, GroupInfo>

const parseId = (instanceId: string) => parseInt(instanceId, 10)

export const normalizeGateway = (gateway: Gateway, lights: DeviceRecord, sensors: DeviceRecord, groups: GroupRecord): GatewayDevices => ({
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
    name: group.name,
    devices: group.deviceIDs,
    moods: R.map(normalizeScene, R.values(scenes)),
})

const normalizeScene = (scene: TScene): Scene => ({
    id: scene.instanceId,
    name: scene.name,
    active: scene.isActive
})
