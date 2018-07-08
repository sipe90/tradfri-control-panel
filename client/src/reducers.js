
import { combineReducers } from 'redux'
import * as R from 'ramda'

import { LOAD_LIGHTS_REQUEST, LOAD_LIGHTS_SUCCESS, LOAD_LIGHTS_FAILURE } from 'actions/lights'
import { LIGHT_STATE_CHANGED } from './actions/lights';

const initialState = {
    loading: false,
    gatewaysById: {},
    lightsById: {},
    gatewayLights: {},
    error: null
}

const indexById = R.indexBy(R.prop('id'))
const pluckById = R.pluck('id')
const gatewaysWithLights = R.filter((gateway) => gateway.lights.length)

const mapLights2 = R.pipe(
    gatewaysWithLights,
    (gateways) => ({
        gatewaysById: indexById(gateways),
        lightsById: indexById(R.flatten(R.map(R.prop('lights'), gateways))),
        gatewayLights: R.reduce((acc, gateway) => 
            R.assoc(gateway.id, pluckById(gateway.lights), acc), {}, gateways)
    })
)

const updateLight = (previousState, payload) => ({
    lightsById: { 
        ...previousState.lightsById, 
        [payload.id]: {
            ...previousState.lightsById[payload.id],
            ...payload 
        } 
    }
})

const lights = (previousState = initialState, { type, payload }) => 
    R.cond([
        [R.equals(LOAD_LIGHTS_REQUEST), () => ({ ...previousState, loading: true })],
        [R.equals(LOAD_LIGHTS_SUCCESS), () => ({ ...previousState, ...mapLights2(payload), loading: false })],
        [R.equals(LOAD_LIGHTS_FAILURE), () => ({ ...previousState, error: payload, loading: false })],
        [R.equals(LIGHT_STATE_CHANGED), () => ({ ...previousState, ...updateLight(previousState, payload) })],
        [R.T, R.always(previousState)]
    ])(type)

const reducers = combineReducers({ lights })

export default reducers
