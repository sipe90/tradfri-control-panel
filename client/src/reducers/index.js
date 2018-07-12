import { combineReducers } from 'redux'

import entityGateways from 'reducers/entities/gateways'
import entityLights from 'reducers/entities/lights'

import moduleLights from 'reducers/modules/lights'

export default combineReducers({
    entities: combineReducers({
        gateways: entityGateways,
        lights: entityLights
    }),
    modules: combineReducers({
        lights: moduleLights
    })
})
