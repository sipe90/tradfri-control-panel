import WebSocketBroker from '#/component/WebSocketBroker'
import TradfriGateway from '#/gateway/TradfriGateway'
import logger from '#/logger'
import { Accessory, AccessoryTypes, AllEventCallbacks, GatewayDetails, Group, Scene } from 'node-tradfri-client'

let _connection: TradfriGateway | null = null
let _broker: WebSocketBroker | null = null

export const setBroker = (webSocketBroker: WebSocketBroker) => _broker = webSocketBroker

export const getBroker = () => {
    if (!_broker) {
        throw Error('Cannot get broker: Not set')
    }
    return _broker
}

export const getConnection = () => {
    if (!_connection) {
        throw Error('Cannot get connection: Not connected to gateway')
    }
    return _connection
}

export const isGatewayConnected = () => _connection ? _connection.isConnected() : false

export const connectToGateway = async (hostname: string, identity: string, psk: string) => {
    logger.info(`Connecting to a trådfri gateway at hostname ${hostname}`)
    const gateway = new TradfriGateway(hostname, true)

    try {
        await gateway.connect(identity, psk)
        logger.info(`Successfully connected to trådfri gateway at ${hostname}`)
    } catch (err) {
        logger.error(`Failed to connect to trådfri gateway at ${hostname}`)
        logger.error(err)
    }

    _connection = gateway
    return _connection
}

export const observeGateway = () => {
    const connection = getConnection()
    const broker = getBroker()

    const observers: Partial<AllEventCallbacks> = {
        'gateway updated': (_gateway: GatewayDetails) => broker.broadcast({
            type: 'update',
            entity: 'gateway'
        }),
        'group updated': (group: Group) => broker.broadcast({
            type: 'update',
            entity: 'group',
            data: { id: group.instanceId }
        }),
        'group removed': (groupId: number) => broker.broadcast({
            type: 'remove',
            entity: 'group',
            data: { id: groupId }
        }),
        'device updated': (device: Accessory) => broker.broadcast({
             type: 'update',
             entity: getDeviceType(device.type),
             data: { id: device.instanceId }
        }),
        'device removed': (deviceId: number) => broker.broadcast({
            type: 'remove',
            entity: getDeviceType(connection.getDevices()[deviceId].type),
            data: { id: deviceId }
        }),
        'scene updated': (groupId: number, scene: Scene) => broker.broadcast({
            type: 'update',
            entity: 'scene',
            data: { groupId, id: scene.instanceId }
        }),
        'scene removed': (groupId: number, id: number) => broker.broadcast({
            type: 'remove',
            entity: 'scene',
            data: { groupId, id }
        })
    }

    connection.registerObservers(observers)
}

const getDeviceType = (type: AccessoryTypes) => {
    switch (type) {
        case AccessoryTypes.lightbulb:
            return 'light'
        case AccessoryTypes.motionSensor:
            return 'sensor'
        default:
            return 'unknown'
    }
}

export const disconnectFromGateway = (clear: boolean) => {
    logger.info('Disconnecting from gateway [clear=%b]', clear)
    if (!_connection && !clear) {
        throw Error('Cannot disconnect: Not connected to gateway')
    }
    if (_connection) {
        _connection.disconnect()
        logger.info('Successfully disconnected from gateway')
    }
    if (clear) {
        logger.info('Clearing gateway connection')
        _connection = null
    }
}
