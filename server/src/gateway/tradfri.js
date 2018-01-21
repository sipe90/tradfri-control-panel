const  { TradfriClient, Accessory, AccessoryTypes } = require('node-tradfri-client')

class TradfriGateway {

    constructor(hostName) {
        this.tradfri = new TradfriClient(hostName)
    }

    async authenticate(securityCode) {
        return await this.tradfri.authenticate(securityCode)
    }

    async connect(identity, psk) {
        const success = await this.tradfri.connect(identity, psk)
        if (success) {
            this.connected = true
        }
    }

    getGroups() {
        return this.tradfri.groups
    }

    getDevices() {
        return this.tradfri.devices
    }
}

module.exports = TradfriGateway
