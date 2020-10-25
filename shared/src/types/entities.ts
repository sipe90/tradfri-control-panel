import { UpdatePriority } from 'node-tradfri-client'

export enum GatewayConnectionState {
    CONNECTED = 1,
    DISCONNECTED = 2,
    OFFLINE = 3
}

export interface Device {
    id: number
    name: string
    alive: boolean
    manufacturer: string
    model: string
    power: number
    battery: number
}

export interface Gateway {
    hostname: string,
    connectionState: GatewayConnectionState
    alexaPairStatus: boolean | null
    googleHomePairStatus: boolean | null
    version: string | null
    updateProgress: number | null
    updatePriority: UpdatePriority | null
    releaseNotes: string | null
    name: string
}

export interface GatewayDevices extends Gateway {
    lights: number[],
    sensors: number[],
    groups: number[]
}

export interface Light extends Device {
    color: string | null
    saturation: number | null
    colorTemperature: number | null
    brightness: number | null
    spectrum: string | null
    dimmable: boolean | null
    switchable: boolean | null
    on: boolean | null
}

export type Sensor = Device

export interface Group {
    id: number
    default: boolean
    name: string
    devices: number[]
    moods: Scene[]
}

export interface LightSetting {
    id: number
    color: string
    saturation: number
    colorTemperature: number
    brightness: number | null
    on: boolean | null
    hue: number
}

export interface Scene {
    id: number
    predefined: boolean
    name: string
    active: boolean
    lightSettings: LightSetting[]
}

export interface DeviceIDs {
    lights: number[]
    sensors: number[]
    groups: number[]
}

export interface CircadianSettings {
    latitude: string
    longitude: string
    groupIds: string[]
}