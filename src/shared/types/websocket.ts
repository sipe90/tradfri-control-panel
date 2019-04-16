export type PayloadTypes = 'update' | 'remove' | 'connection_state'
export type Entities = 'gateway' | 'light' | 'sensor' | 'group' | 'scene'
export type Payloads =
    GatewayUpdate |
    GroupUpdate | GroupRemove |
    LightUpdate | LightRemove |
    SensorUpdate | SensorRemove |
    SceneUpdate | SceneRemove

export interface IPayload<T extends string = string, E extends string = string, D = any> {
    type: T
    entity: E
    data?: D
}

export type EntityPayload<T extends PayloadTypes, E extends Entities, D = any> = IPayload<T, E, D>

interface IIdContainer { id: number }
interface IGroupIdContainer { groupId: number }

export type GatewayUpdate = EntityPayload<'update', 'gateway', undefined>
export type GroupUpdate = EntityPayload<'update', 'group', IIdContainer>
export type GroupRemove = EntityPayload<'remove', 'group', IIdContainer>
export type LightUpdate = EntityPayload<'update', 'light', IIdContainer>
export type LightRemove = EntityPayload<'remove', 'light', IIdContainer>
export type SensorUpdate = EntityPayload<'update', 'sensor', IIdContainer>
export type SensorRemove = EntityPayload<'remove', 'sensor', IIdContainer>
export type SceneUpdate = EntityPayload<'update', 'scene', IIdContainer & IGroupIdContainer>
export type SceneRemove = EntityPayload<'remove', 'scene', IIdContainer & IGroupIdContainer>
export type GatewayConnectionState = EntityPayload<'connection_state', 'gateway', { state: GatewayConnectionState }>
