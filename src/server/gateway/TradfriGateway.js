const { TradfriClient, AccessoryTypes, discoverGateway } = require('node-tradfri-client')
const { filterObj } = require('utils')

class TradfriGateway {

    constructor(hostName) {
        this.client = new TradfriClient(hostName)
    }

    static discover() {
        return discoverGateway()
    }

    async authenticate(securityCode) {
        return await this.client.authenticate(securityCode)
    }

    async connect(identity, psk, observe = true) {
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
        return this.hostName
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
        return filterObj(
            (instanceId, device) =>
                device.type === AccessoryTypes.lightbulb,
            this.getDevices())
    }

    getSensors() {
        return filterObj(
            (instanceId, device) =>
                device.type === AccessoryTypes.motionSensor,
            this.getDevices())
    }

    async updateLight(lightId, lightUpdate) {
        const lightAccessory = this.getLights()[lightId]
        if (!lightAccessory) {
            throw new Error(`No light with id ${lightId} found`)
        }
        const updatedAccessory = lightAccessory.clone()
        updatedAccessory.name = lightUpdate.name || lightAccessory.name
        return this.client.updateDevice(updatedAccessory)
    }

    async operateLight(lightId, lightOperation) {
        const lightAccessory = this.getLights()[lightId]
        if (!lightAccessory) {
            throw new Error(`No light with id ${lightId} found`)
        }
        return this.client.operateLight(lightAccessory, lightOperation)
    }

    async updateGroup(groupId, groupUpdate) {
        const groupInfo = this.getGroups()[groupId]
        if (!groupInfo) {
            throw new Error(`No group with id ${groupId} found`)
        }
        groupInfo.group.name = groupUpdate.name || groupInfo.group.name
        return this.client.updateGroup(groupInfo.group)
    }

    async operateGroup(groupId, groupOperation) {
        const groupInfo = this.getGroups()[groupId]
        if (!groupInfo) {
            throw new Error(`No group with id ${groupId} found`)
        }
        return this.client.operateGroup(groupInfo.group, groupOperation)
    }
}

module.exports = TradfriGateway
