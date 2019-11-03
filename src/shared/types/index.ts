import { UpdatePriority } from 'node-tradfri-client'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Nullable<T> = {[P in keyof T]: T[P] | null}

export type Diff<T extends string, U extends string> = ({[P in T]: P} &
    {[P in U]: never} & {[x: string]: never})[T]

// tslint:disable-next-line:interface-over-type-literal
export type Dictionary<T> = {[key: string]: T}

export enum GatewayConnectionState {
    CONNECTED = 1,
    DISCONNECTED = 2,
    OFFLINE = 3
}

export interface IDevice {
    id: number
    name: string
    alive: boolean
    manufacturer: string
    model: string
    power: number
    battery: number
}

export interface IGateway {
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

export interface IGatewayDevices extends IGateway {
    lights: number[],
    sensors: number[],
    groups: number[]
}

export interface ILight extends IDevice {
    color: string | null
    colorTemperature: number | null
    brightness: number | null
    spectrum: string | null
    dimmable: boolean | null
    switchable: boolean | null
    on: boolean | null
}

export type ISensor = IDevice

export interface IGroup {
    id: number
    name: string
    devices: number[]
    moods: IScene[]
}

export interface IScene {
    id: number
    name: string
    active: boolean
}

export interface IDeviceIDs {
    lights: number[]
    sensors: number[]
    groups: number[]
}

export interface IGroupUpdateRequest {
    id: number
    name?: string
    on?: boolean
    brightness?: number
}

export interface ICreateGatewayRequest {
    name: string
    hostname: string
    identity: string
    psk: string
}

export interface IUpdateGatewayRequest {
    name: string
    hostname: string
}

export interface IUpdateCircadianSettingsRequest {
    latitude: string
    longitude: string
}

export interface IGenerateIdentityRequest {
    hostname: string
    securityCode: string
}

export interface ITestConnectionRequest {
    hostname: string
    identity: string
    psk: string
}

export interface ICircadianSettings {
    latitude: string
    longitude: string
    groupIds: string[]
}
