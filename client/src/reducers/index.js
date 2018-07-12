import { combineReducers } from 'redux'

import entityGateways from 'reducers/entities/gateways'
import entityLights from 'reducers/entities/lights'
import entitySensors from 'reducers/entities/sensors'

import moduleLights from 'reducers/modules/lights'
import moduleSensors from 'reducers/modules/sensors'

export default combineReducers({
    entities: combineReducers({
        gateways: entityGateways,
        lights: entityLights,
        sensors: entitySensors
    }),
    modules: combineReducers({
        lights: moduleLights,
        sensors: moduleSensors
    })
})
