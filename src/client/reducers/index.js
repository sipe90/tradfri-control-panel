import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import entityGateway from 'reducers/entities/gateway'
import entityLights from 'reducers/entities/lights'
import entitySensors from 'reducers/entities/sensors'

import moduleGateway from 'reducers/modules/gateway'
import moduleLights from 'reducers/modules/lights'
import moduleSensors from 'reducers/modules/sensors'

export default combineReducers({
    entities: combineReducers({
        gateway: entityGateway,
        lights: entityLights,
        sensors: entitySensors
    }),
    modules: combineReducers({
        gateway: moduleGateway,
        lights: moduleLights,
        sensors: moduleSensors
    }),
    form: formReducer
})
