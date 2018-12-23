export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Diff<T extends string, U extends string> = ({[P in T]: P} &
    {[P in U]: never} & {[x: string]: never})[T]

export interface Dictionary<T> {
    [key: string]: T
}

export interface Device {
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
    spectrum: string;
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

export interface GroupUpdateRequest {
    id: number;
    name?: string;
    on?: boolean;
    brightness?: number;
}