import {
    Accessory, AccessoryTypes, discoverGateway,
    GroupOperation, LightOperation, LoggerFunction, TradfriClient
} from 'node-tradfri-client'
import R from 'ramda'

import logger from '#/logger'

type DeviceTypeFilter = (type: AccessoryTypes) => (devices: Record<string, Accessory>) => Record<string, Accessory>

const filterDevice: DeviceTypeFilter = (type: AccessoryTypes) => R.pickBy(R.propEq('type', type))

const filterLights = filterDevice(AccessoryTypes.lightbulb)
const filterSensors = filterDevice(AccessoryTypes.motionSensor)

const loggerFn: LoggerFunction = (message, severity) => logger[severity || 'info'](`(NTC): ${message}`)

export default class TradfriGateway {

    public static discover() {
        return discoverGateway()
    }

    private client: TradfriClient
    private connected: boolean = false
    private hostname: string

    constructor(hostname: string) {
        this.hostname = hostname
        this.client = new TradfriClient(hostname, loggerFn)
    }

    public async authenticate(securityCode: string) {
        return await this.client.authenticate(securityCode)
    }

    public async connect(identity: string, psk: string, observe = true) {
        await this.client.connect(identity, psk)
        observe && await this.client.observeDevices()
        observe && await this.client.observeGroupsAndScenes()
        this.connected = true
    }

    public disconnect() {
        this.client.destroy()
        this.connected = false
    }

    public getHostname() {
        return this.hostname
    }

    public isConnected() {
        return this.connected
    }

    public getGroups() {
        return this.client.groups
    }

    public getDevices() {
        return this.client.devices
    }

    public getLights() {
        return filterLights(this.getDevices())
    }

    public getSensors() {
        return filterSensors(this.getDevices())
    }

    public async updateLight(deviceId: string, lightUpdate: Partial<Accessory>) {
        const lightAccessory = this.getLights()[deviceId]
        if (!lightAccessory) {
            throw new Error(`No light with id ${deviceId} found`)
        }
        const updatedAccessory = lightAccessory.clone()
        updatedAccessory.name = lightUpdate.name || lightAccessory.name
        return this.client.updateDevice(updatedAccessory)
    }

    public async operateLight(deviceId: string, lightOperation: LightOperation) {
        const lightAccessory = this.getLights()[deviceId]
        if (!lightAccessory) {
            throw new Error(`No light with id ${deviceId} found`)
        }
        return this.client.operateLight(lightAccessory, lightOperation)
    }

    public async updateGroup(deviceId: string, groupUpdate: Partial<Accessory>) {
        const groupInfo = this.getGroups()[deviceId]
        if (!groupInfo) {
            throw new Error(`No group with id ${deviceId} found`)
        }
        groupInfo.group.name = groupUpdate.name || groupInfo.group.name
        return this.client.updateGroup(groupInfo.group)
    }

    public async operateGroup(deviceId: string, groupOperation: GroupOperation) {
        const groupInfo = this.getGroups()[deviceId]
        if (!groupInfo) {
            throw new Error(`No group with id ${deviceId} found`)
        }
        return this.client.operateGroup(groupInfo.group, groupOperation)
    }
}
