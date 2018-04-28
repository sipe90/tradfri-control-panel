const  { TradfriClient, Accessory, AccessoryTypes, discoverGateway  } = require('node-tradfri-client')
const R = require('ramda')

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

    async connect(identity, psk) {
        await this.client.connect(identity, psk)
        await this.client.observeDevices()
        this.connected = true
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
        return R.filter((device) => device.type === AccessoryTypes.lightbulb || device.type === 1, R.values(this.getDevices()))
    }

    getSensors() {
        return R.filter((device) => device.type === AccessoryTypes.motionSensor, R.values(this.getDevices()))
    }
}

module.exports = TradfriGateway
