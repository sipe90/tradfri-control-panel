import { GatewayConnectionState } from './entities'

export type PayloadTypes = 'update' | 'remove' | 'connection_state'
export type Entities = 'gateway' | 'light' | 'sensor' | 'group' | 'scene'
export type Payloads =
    GatewayUpdatePayload |
    GroupUpdatePayload | GroupRemovePayload |
    LightUpdatePayload | LightRemovePayload |
    SensorUpdatePayload | SensorRemovePayload |
    SceneUpdatePayload | SceneRemovePayload

export interface Payload<T extends string = string, E extends string = string, D = any> {
    type: T
    entity: E
    data?: D
}

export type EntityPayload<T extends PayloadTypes, E extends Entities, D = any> = Payload<T, E, D>

interface IdContainer { id: number }
interface GroupIdContainer { groupId: number }

export type GatewayUpdatePayload = EntityPayload<'update', 'gateway', undefined>
export type GroupUpdatePayload = EntityPayload<'update', 'group', IdContainer>
export type GroupRemovePayload = EntityPayload<'remove', 'group', IdContainer>
export type LightUpdatePayload = EntityPayload<'update', 'light', IdContainer>
export type LightRemovePayload = EntityPayload<'remove', 'light', IdContainer>
export type SensorUpdatePayload = EntityPayload<'update', 'sensor', IdContainer>
export type SensorRemovePayload = EntityPayload<'remove', 'sensor', IdContainer>
export type SceneUpdatePayload = EntityPayload<'update', 'scene', IdContainer & GroupIdContainer>
export type SceneRemovePayload = EntityPayload<'remove', 'scene', IdContainer & GroupIdContainer>
export type GatewayConnectionStatePayload = EntityPayload<'connection_state', 'gateway', { state: GatewayConnectionState }>
