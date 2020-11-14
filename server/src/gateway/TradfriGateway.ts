import {
    Accessory, AccessoryTypes, AllEventCallbacks,
    discoverGateway, GatewayDetails,
    Group, GroupInfo, GroupOperation,
    LightOperation, LoggerFunction, Scene, TradfriClient
} from 'node-tradfri-client'
import R from 'ramda'

import logger from '#/logger'
import { GatewayConnectionState } from 'shared'

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
        observe && await this.setupInternalObservers()
    }

    public disconnect() {
        this.client.destroy()
        this.connectionState = GatewayConnectionState.DISCONNECTED
    }

    public rebootGateway = async () => {
        logger.info('Rebooting gateway')
        const started = await this.client.rebootGateway()
        !started && logger.error('Gateway could not be rebooted')
        return started
    }

    public factoryReset = async () => {
        logger.warn('Initiating factory reset on the gateway')
        const started = await this.client.resetGateway()
        !started && logger.error('Gateway could not be reset')
        return started
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

    public async updateGroup(groupId: string, groupUpdate: Partial<Accessory>) {
        const groupInfo = this.getGroups()[groupId]
        if (!groupInfo) {
            throw new Error(`No group with id ${groupId} found`)
        }
        const group = groupInfo.group
        group.name = groupUpdate.name || group.name
        return this.client.updateGroup(group)
    }

    public async operateGroup(groupId: string, groupOperation: GroupOperation) {
        const groupInfo = this.getGroups()[groupId]
        if (!groupInfo) {
            throw new Error(`No group with id ${groupId} found`)
        }
        const group = groupInfo.group
        return this.client.operateGroup(group, groupOperation)
    }

    public registerObservers = async (observers: Partial<AllEventCallbacks>) => {
        logger.info('Registering external observers')
        R.forEachObjIndexed((callback, event) => this.client.on(event, callback as any), observers)
    }

    private setupInternalObservers = async () => {
        this.registerInternalObservers()
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

    private registerInternalObservers = () => {
        this.client.on('gateway updated', this.onGatewayUpdate.bind(this))
        this.client.on('device updated', this.onDeviceUpdate.bind(this))
        this.client.on('device removed', this.onDeviceRemove.bind(this))
        this.client.on('group updated', this.onGroupUpdate.bind(this))
        this.client.on('group removed', this.onGroupRemove.bind(this))
        this.client.on('scene updated', this.onSceneUpdate.bind(this))
        this.client.on('scene removed', this.onSceneRemove.bind(this))
        this.client.on('connection lost', this.onConnectionLost.bind(this))
        this.client.on('gateway offline', this.onGatewayOffline.bind(this))
        this.client.on('connection alive', this.onConnectionAlive.bind(this))
        this.client.on('error', logger.error)
    }

    private onGatewayUpdate = (gateway: GatewayDetails) => {
        this.gateway ? logger.info('Updating gateway details') : logger.info('Initializing gateway details')
        this.gateway = gateway
    }

    private onDeviceUpdate = (device: Accessory) => {
        logger.info('Updating device [%d:%s]', device.instanceId, device.name)
        this.devices = R.assoc(String(device.instanceId), device.clone(), this.devices)
    }

    private onDeviceRemove = (instanceId: number) => {
        logger.info('Removing device [%d:%s]', instanceId, R.path([instanceId, 'name'], this.devices))
        this.devices = R.dissoc(String(instanceId), this.devices)
    }

    private onGroupUpdate = (group: Group) => {
        logger.info('Updating group [%d:%s]', group.instanceId, group.name)
        this.groups = R.assocPath([group.instanceId, 'group'], group.clone(), this.groups)
    }

    private onGroupRemove = (instanceId: number) => {
        logger.info('Removing group [%d:%s]', instanceId, R.path([instanceId, 'group', 'name'], this.groups))
        this.groups = R.dissoc(String(instanceId), this.groups)
    }

    private onSceneUpdate = (groupId: number, scene: Scene) => {
        logger.info('Updating scene [%d:%s] in group [%d:%s]',
            scene.instanceId, scene.name, groupId, R.path([groupId, 'group', 'name'], this.groups))
        this.groups = R.assocPath([groupId, 'scenes', scene.instanceId], scene.clone(), this.groups)
    }

    private onSceneRemove = (groupId: number, instanceId: number) => {
        logger.info('Removing scene [%d:%s] from group [%d:%s]',
            instanceId, R.path([groupId, 'scenes', instanceId, 'name'], this.groups),
            groupId, R.path([groupId, 'group', 'name'], this.groups))
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
