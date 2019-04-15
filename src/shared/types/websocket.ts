export type PayloadTypes = 'update' | 'remove'
export type Entities = 'gateway' | 'device' | 'group' | 'scene'
export type Payloads =
    GatewayUpdate |
    GroupUpdate | GroupRemove |
    DeviceUpdate | DeviceRemove |
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
export type DeviceUpdate = EntityPayload<'update', 'device', IIdContainer>
export type DeviceRemove = EntityPayload<'remove', 'device', IIdContainer>
export type SceneUpdate = EntityPayload<'update', 'scene', IIdContainer & IGroupIdContainer>
export type SceneRemove = EntityPayload<'remove', 'scene', IIdContainer & IGroupIdContainer>
