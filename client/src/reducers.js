
import { combineReducers } from 'redux'
import * as R from 'ramda'

import { LOAD_LIGHTS_REQUEST, LOAD_LIGHTS_SUCCESS, LOAD_LIGHTS_FAILURE } from 'actions/lights'

const initialState = {
    loading: false,
    lightsByGateway: [],
    error: null
}

const lights = (previousState = initialState, { type, payload }) => 
    R.cond([
        [R.equals(LOAD_LIGHTS_REQUEST), () => ({ ...previousState, loading: true })],
        [R.equals(LOAD_LIGHTS_SUCCESS), () => ({ ...previousState, lightsByGateway: payload, loading: false })],
        [R.equals(LOAD_LIGHTS_FAILURE), () => ({ ...previousState, error: payload, loading: false })],
        [R.T, R.always(previousState)]
    ])(type)

const reducers = combineReducers({ lights })

export default reducers
