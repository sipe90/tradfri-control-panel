import {
    Accessory, AccessoryTypes, discoverGateway,
    GatewayDetails, Group, GroupInfo, GroupOperation, LightOperation, LoggerFunction, Scene, TradfriClient
} from 'node-tradfri-client'
import R from 'ramda'

import logger from '#/logger'
import { GatewayConnectionState } from 'shared/types'

type DeviceTypeFilter = (type: AccessoryTypes) => (devices: Record<string, Accessory>) => Record<string, Accessory>

const filterDevice: DeviceTypeFilter = (type: AccessoryTypes) => R.pickBy(R.propEq('type', type))

const filterLights = filterDevice(AccessoryTypes.lightbulb)
const filterSensors = filterDevice(AccessoryTypes.motionSensor)
const filterPlugs = filterDevice(AccessoryTypes.plug)

const loggerFn: LoggerFunction = (message, severity) =>
    logger[severity === 'info' ? 'debug' : (severity || 'info')](`(NTC): ${message}`)

export default class TradfriGateway {

    public static discover() {
        return discoverGateway()
    }

    private client: TradfriClient
    private connectionState: GatewayConnectionState
    private gateway: GatewayDetails | null
    private devices: Record<string, Accessory>
    private groups: Record<string, GroupInfo>

    constructor(hostname: string, watchConnection: boolean) {
        this.connectionState = GatewayConnectionState.OFFLINE
        this.gateway = null
        this.devices = {}
        this.groups = {}

        this.client = new TradfriClient(hostname, { customLogger: loggerFn, watchConnection })
    }

    public async authenticate(securityCode: string) {
        return await this.client.authenticate(securityCode)
    }

    public async connect(identity: string, psk: string, observe = true) {
        logger.info('Connecting to gateway at %s...', this.getHostname())
        await this.client.connect(identity, psk)
        logger.info('Connected to gateway')
        this.connectionState = GatewayConnectionState.CONNECTED
        if (observe) {
            this.registerObservers()
            logger.info('Fetching and registering gateway resources...')
            await this.client.observeGateway()
            await this.client.observeDevices()
            await this.client.observeGroupsAndScenes()

            const groups = R.keys(this.getGroups()).length
            const lights = R.keys(this.getLights()).length
            const sensors = R.keys(this.getSensors()).length
            const plugs = R.keys(this.getPlugs()).length

            logger.info('Finished registering resources. Recieved %d groups, %d lights, %d sensors and %d plugs',
                groups, lights, sensors, plugs)
        }
    }

    public disconnect() {
        this.client.destroy()
        this.connectionState = GatewayConnectionState.DISCONNECTED
    }

    public getHostname() {
        return this.client.hostname
    }

    public getConnectionState() {
        return this.connectionState
    }

    public isConnected() {
        return this.connectionState === GatewayConnectionState.CONNECTED
    }

    public getGateway() {
        return this.gateway
    }

    public getGroups() {
        return this.groups
    }

    public getDevices() {
        return this.devices
    }

    public getLights() {
        return filterLights(this.getDevices())
    }

    public getSensors() {
        return filterSensors(this.getDevices())
    }

    public getPlugs() {
        return filterPlugs(this.getDevices())
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
        const group = groupInfo.group
        group.name = groupUpdate.name || group.name
        return this.client.updateGroup(group)
    }

    public async operateGroup(deviceId: string, groupOperation: GroupOperation) {
        const groupInfo = this.getGroups()[deviceId]
        if (!groupInfo) {
            throw new Error(`No group with id ${deviceId} found`)
        }
        const group = groupInfo.group
        return this.client.operateGroup(group, groupOperation)
    }

    private registerObservers() {
        this.client.on('gateway updated',  this.onGatewayUpdate)
        this.client.on('device updated',   this.onDeviceUpdate)
        this.client.on('device removed',   this.onDeviceRemove)
        this.client.on('group updated',    this.onGroupUpdate)
        this.client.on('group removed',    this.onGroupRemove)
        this.client.on('scene updated',    this.onSceneUpdate)
        this.client.on('scene removed',    this.onSceneRemove)
        this.client.on('connection lost',  this.onConnectionLost)
        this.client.on('gateway offline',  this.onGatewayOffline)
        this.client.on('connection alive', this.onConnectionAlive)
        this.client.on('error',            logger.error)
    }

    private onGatewayUpdate = (gateway: GatewayDetails) => {
        this.gateway ? logger.info('Initializing gateway details') : logger.info('Updating gateway details')
        this.gateway = gateway
    }

    private onDeviceUpdate = (device: Accessory) => {
        logger.info('Updating device [%d]', device.instanceId)
        this.devices = R.assoc(String(device.instanceId), device, this.devices)
    }

    private onDeviceRemove = (instanceId: number) => {
        logger.info('Removing device [%d]', instanceId)
        this.devices = R.dissoc(String(instanceId), this.devices)
    }

    private onGroupUpdate = (group: Group) => {
        logger.info('Updating group [%d]', group.instanceId)
        this.groups = R.assocPath([group.instanceId, 'group'], group, this.groups)
    }

    private onGroupRemove = (instanceId: number) => {
        logger.info('Removing group [%d]', instanceId)
        this.groups = R.dissoc(String(instanceId), this.groups)
    }

    private onSceneUpdate = (groupId: number, scene: Scene) => {
        logger.info('Updating scene [%d] in group [%d]', scene.instanceId, groupId)
        this.groups = R.assocPath([groupId, 'scenes', scene.instanceId], scene, this.groups)
    }

    private onSceneRemove = (groupId: number, instanceId: number) => {
        logger.info('Removing scene [%d] from group [%d]', instanceId, groupId)
        this.groups = R.dissocPath([groupId, 'scenes', instanceId], this.groups)
    }

    private onConnectionLost = () => {
        logger.warn('Connection to gateway lost')
        this.setConnectionState(GatewayConnectionState.DISCONNECTED)
    }

    private onGatewayOffline = () => {
        logger.warn('Gateway has gone offline')
        this.setConnectionState(GatewayConnectionState.OFFLINE)
    }

    private onConnectionAlive = () => {
        logger.warn('Gateway connection restored')
        this.setConnectionState(GatewayConnectionState.CONNECTED)
    }

    private setConnectionState = (connectionState: GatewayConnectionState) => {
        this.connectionState = connectionState
    }
}
