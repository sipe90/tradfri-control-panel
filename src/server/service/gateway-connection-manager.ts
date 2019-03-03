import WebSocketBroker from '#/component/WebSocketBroker'
import TradfriGateway from '#/gateway/TradfriGateway'
import logger from '#/logger'
import { Accessory, AllEventCallbacks, GatewayDetails, Group, Scene } from 'node-tradfri-client'
import { Entities, PayloadTypes } from 'shared/types'

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

    const sendData = dataSender(broker)

    const observers: Partial<AllEventCallbacks> = {
        'gateway updated': (gateway: GatewayDetails) => sendData('update', 'gateway', gateway.clone()),
        'group updated': (group: Group) => sendData('update', 'group', group.clone()),
        'group removed': (groupId: number) => sendData('remove', 'group', groupId),
        'device updated': (device: Accessory) => sendData('update', 'device', device.clone()),
        'device removed': (deviceId: number) => sendData('remove', 'device', deviceId),
        'scene updated': (groupId: number, scene: Scene) => sendData('update', 'scene', { ...scene.clone(), groupId }),
        'scene removed': (groupId: number, sceneId: number) => sendData('remove', 'scene', { groupId, sceneId }),
    }

    connection.registerObservers(observers)
}

const dataSender = (broker: WebSocketBroker) => (type: PayloadTypes, entity: Entities, data: any) =>
    broker.broadcast({ type, entity, data })

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
