import { combineReducers } from 'redux'

import common, { CommonState } from '#/reducers/common'

import entityGateway, { GatewayEntityState } from '#/reducers/entities/gateway'
import entityGroups, { GroupEntitiesState } from '#/reducers/entities/groups'
import entityLights, { LightEntitiesState } from '#/reducers/entities/lights'
import entitySensors, { SensorEntitiesState } from '#/reducers/entities/sensors'
import entitySettings, { SettingsEntitiesState } from '#/reducers/entities/settings'

import moduleGateway, { GatewayModuleState } from '#/reducers/modules/gateway'
import moduleLights, { LightsModuleState } from '#/reducers/modules/lights'
import moduleSensors, { SensorsModuleState } from '#/reducers/modules/sensors'
import moduleSettings, { SettingsModuleState } from '#/reducers/modules/settings'

interface EntitiesState {
    gateway: GatewayEntityState
    groups: GroupEntitiesState
    lights: LightEntitiesState
    sensors: SensorEntitiesState
    settings: SettingsEntitiesState
}

interface ModulesState {
    gateway: GatewayModuleState
    lights: LightsModuleState
    sensors: SensorsModuleState
    settings: SettingsModuleState
}

export interface AppState {
    common: CommonState
    entities: EntitiesState
    modules: ModulesState
}

export default combineReducers<AppState>({
    common,
    entities: combineReducers({
        gateway: entityGateway,
        groups: entityGroups,
        lights: entityLights,
        sensors: entitySensors,
        settings: entitySettings
    }),
    modules: combineReducers({
        gateway: moduleGateway,
        lights: moduleLights,
        sensors: moduleSensors,
        settings: moduleSettings
    }),
})
