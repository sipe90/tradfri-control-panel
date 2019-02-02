import { combineReducers } from 'redux'
import { FormStateMap, reducer as formReducer } from 'redux-form'

import entityGateway, { GatewayEntityState } from '@/reducers/entities/gateway'
import entityGroups, { GroupEntitiesState } from '@/reducers/entities/groups'
import entityLights, { LightEntitiesState } from '@/reducers/entities/lights'
import entitySensors, { SensorEntitiesState } from '@/reducers/entities/sensors'
import entitySettings, { ISettingsEntitiesState } from './entities/settings'

import moduleGateway, { IGatewayModuleState } from '@/reducers/modules/gateway'
import moduleLights, { ILightsModuleState } from '@/reducers/modules/lights'
import moduleSensors, { ISensorsModuleState } from '@/reducers/modules/sensors'
import moduleSettings, { ISettingsModuleState } from './modules/settings'

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
    entities: IEntitiesState
    form: FormStateMap
    modules: IModulesState
}

export default combineReducers<IAppState>({
    entities: combineReducers({
        gateway: entityGateway,
        groups: entityGroups,
        lights: entityLights,
        sensors: entitySensors,
        settings: entitySettings
    }),
    form: formReducer,
    modules: combineReducers({
        gateway: moduleGateway,
        lights: moduleLights,
        sensors: moduleSensors,
        settings: moduleSettings
    }),
})
