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

interface IIdContainer { id: number }
interface GroupIdContainer { groupId: number }

export type GatewayUpdatePayload = EntityPayload<'update', 'gateway', undefined>
export type GroupUpdatePayload = EntityPayload<'update', 'group', IIdContainer>
export type GroupRemovePayload = EntityPayload<'remove', 'group', IIdContainer>
export type LightUpdatePayload = EntityPayload<'update', 'light', IIdContainer>
export type LightRemovePayload = EntityPayload<'remove', 'light', IIdContainer>
export type SensorUpdatePayload = EntityPayload<'update', 'sensor', IIdContainer>
export type SensorRemovePayload = EntityPayload<'remove', 'sensor', IIdContainer>
export type SceneUpdatePayload = EntityPayload<'update', 'scene', IIdContainer & GroupIdContainer>
export type SceneRemovePayload = EntityPayload<'remove', 'scene', IIdContainer & GroupIdContainer>
export type GatewayConnectionStatePayload = EntityPayload<'connection_state', 'gateway', { state: GatewayConnectionState }>
