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

    updateLight(light) {
        const lightAccessory = this.getLights()[light.id]
        if (!lightAccessory) {
            throw Error(`No light with id ${light.id} found`)
        }
        const updatedAccessory = lightAccessory.clone()
        updatedAccessory.name = light.name || lightAccessory.name
        const lightOperation = {
            onOff: light.on || lightAccessory.onOff,
            dimmer: light.brightness || lightAccessory.dimmer,
            colorTemperature: light.colorTemperature || lightAccessory.colorTemperature
        }
        this.client.updateDevice(updatedAccessory)
        this.client.operateLight(updatedAccessory, lightOperation)
    }

    updateGroup(group) {
        const groupInfo = this.getGroups()[group.id]
        if (!groupInfo) {
            throw Error(`No group with id ${groupInfo.id} found`)
        }
        // TODO: Update group
    }
}

module.exports = TradfriGateway
