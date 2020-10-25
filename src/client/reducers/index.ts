import { combineReducers } from 'redux'

import common, { ICommonState } from '@/reducers/common'

import entityGateway, { GatewayEntityState } from '@/reducers/entities/gateway'
import entityGroups, { GroupEntitiesState } from '@/reducers/entities/groups'
import entityLights, { LightEntitiesState } from '@/reducers/entities/lights'
import entitySensors, { SensorEntitiesState } from '@/reducers/entities/sensors'
import entitySettings, { ISettingsEntitiesState } from '@/reducers/entities/settings'

import moduleGateway, { IGatewayModuleState } from '@/reducers/modules/gateway'
import moduleLights, { ILightsModuleState } from '@/reducers/modules/lights'
import moduleSensors, { ISensorsModuleState } from '@/reducers/modules/sensors'
import moduleSettings, { ISettingsModuleState } from '@/reducers/modules/settings'

interface IEntitiesState {
    gateway: GatewayEntityState
    groups: GroupEntitiesState
    lights: LightEntitiesState
    sensors: SensorEntitiesState
    settings: ISettingsEntitiesState
}

interface IModulesState {
    gateway: IGatewayModuleState
    lights: ILightsModuleState
    sensors: ISensorsModuleState
    settings: ISettingsModuleState
}

export interface IAppState {
    common: ICommonState
    entities: IEntitiesState
    modules: IModulesState
}

export default combineReducers<IAppState>({
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
