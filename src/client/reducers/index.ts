import { combineReducers } from 'redux'
import { FormStateMap, reducer as formReducer } from 'redux-form'

import entityGateway, { GatewayEntityState } from '@/reducers/entities/gateway'
import entityGroups, { GroupEntitiesState } from '@/reducers/entities/groups'
import entityLights, { LightEntitiesState } from '@/reducers/entities/lights'
import entitySensors, { SensorEntitiesState } from '@/reducers/entities/sensors'

import moduleGateway, { IGatewayModuleState } from '@/reducers/modules/gateway'
import moduleLights, { ILightsModuleState } from '@/reducers/modules/lights'
import moduleSensors, { ISensorsModuleState } from '@/reducers/modules/sensors'

interface IEntitiesState {
    gateway: GatewayEntityState
    groups: GroupEntitiesState
    lights: LightEntitiesState
    sensors: SensorEntitiesState
}

interface IModulesState {
    gateway: IGatewayModuleState
    lights: ILightsModuleState
    sensors: ISensorsModuleState
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
    }),
    form: formReducer,
    modules: combineReducers({
        gateway: moduleGateway,
        lights: moduleLights,
        sensors: moduleSensors,
    }),
})
