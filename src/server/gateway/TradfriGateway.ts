import R from 'ramda'
import { TradfriClient, AccessoryTypes, discoverGateway, Accessory, LightOperation, GroupOperation } from 'node-tradfri-client'

type DeviceTypeFilter = (type: AccessoryTypes) => (devices: Record<string, Accessory>) => Record<string, Accessory>

const filterDevice: DeviceTypeFilter = (type: AccessoryTypes) => R.pickBy(R.propEq(type))

const filterLights = filterDevice(AccessoryTypes.lightbulb)
const filterSensors = filterDevice(AccessoryTypes.motionSensor)

export default class TradfriGateway {

    client: TradfriClient
    connected: boolean = false;
    hostname: string

    constructor(hostname: string) {
        this.hostname = hostname
        this.client = new TradfriClient(hostname)
    }

    static discover() {
        return discoverGateway()
    }

    async authenticate(securityCode: string) {
        return await this.client.authenticate(securityCode)
    }

    async connect(identity: string, psk: string, observe = true) {
        await this.client.connect(identity, psk)
        observe && await this.client.observeDevices()
        observe && await this.client.observeGroupsAndScenes()
        this.connected = true
    }

    disconnect() {
        this.client.destroy()
        this.connected = false
    }

    getHostname() {
        return this.hostname
    }

    isConnected() {
        return this.connected
    }

    getGroups() {
        return this.client.groups
    }

    getDevices() {
        return this.client.devices
    }

    getLights() {
        return filterLights(this.getDevices())
    }

    getSensors() {
        return filterSensors(this.getDevices())
    }

    async updateLight(deviceId: string, lightUpdate: Partial<Accessory>) {
        const lightAccessory = this.getLights()[deviceId]
        if (!lightAccessory) {
            throw new Error(`No light with id ${deviceId} found`)
        }
        const updatedAccessory = lightAccessory.clone()
        updatedAccessory.name = lightUpdate.name || lightAccessory.name
        return this.client.updateDevice(updatedAccessory)
    }

    async operateLight(deviceId: string, lightOperation: LightOperation) {
        const lightAccessory = this.getLights()[deviceId]
        if (!lightAccessory) {
            throw new Error(`No light with id ${deviceId} found`)
        }
        return this.client.operateLight(lightAccessory, lightOperation)
    }

    async updateGroup(deviceId: string, groupUpdate: Partial<Accessory>) {
        const groupInfo = this.getGroups()[deviceId]
        if (!groupInfo) {
            throw new Error(`No group with id ${deviceId} found`)
        }
        groupInfo.group.name = groupUpdate.name || groupInfo.group.name
        return this.client.updateGroup(groupInfo.group)
    }

    async operateGroup(deviceId: string, groupOperation: GroupOperation) {
        const groupInfo = this.getGroups()[deviceId]
        if (!groupInfo) {
            throw new Error(`No group with id ${deviceId} found`)
        }
        return this.client.operateGroup(groupInfo.group, groupOperation)
    }
}
