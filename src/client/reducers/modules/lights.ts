import { Reducer } from 'redux'

import {
    LOAD_LIGHTS_FAILURE, LOAD_LIGHTS_REQUEST, LOAD_LIGHTS_SUCCESS,
} from '@/actions/lights'
import { createReducer } from '@/utils'

interface ILightsModuleState {
    initialDataLoading: boolean
}

const initialState = {
    initialDataLoading: true,
}

const reducer = createReducer<ILightsModuleState>([
    [LOAD_LIGHTS_REQUEST, (state) => ({
        ...state,
    })],
    [LOAD_LIGHTS_SUCCESS, (state) => ({
        ...state,
        initialDataLoading: false,
    })],
    [LOAD_LIGHTS_FAILURE, (state) => ({
        ...state,
        initialDataLoading: false,
    })],
])

const lightsModuleReducer: Reducer<ILightsModuleState> = (state = initialState, action) => reducer(state, action)

export default lightsModuleReducer
