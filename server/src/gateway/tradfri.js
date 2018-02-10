const  { TradfriClient, Accessory, AccessoryTypes } = require('node-tradfri-client')

class TradfriGateway {

    constructor(hostName) {
        this.client = new TradfriClient(hostName)
    }

    async authenticate(securityCode) {
        return await this.client.authenticate(securityCode)
    }

    async connect(identity, psk) {
        const success = await this.client.connect(identity, psk)
        if (success) {
            await this.client.observeDevices()
            this.connected = true
        }
        return success
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
}

module.exports = TradfriGateway
