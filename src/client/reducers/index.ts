import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import entityGateway from '@/reducers/entities/gateway'
import entityGroups from '@/reducers/entities/groups'
import entityLights from '@/reducers/entities/lights'
import entitySensors from '@/reducers/entities/sensors'

import moduleGateway from '@/reducers/modules/gateway'
import moduleLights from '@/reducers/modules/lights'
import moduleSensors from '@/reducers/modules/sensors'

export default combineReducers({
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
