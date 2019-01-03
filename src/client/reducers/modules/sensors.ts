import { Reducer } from 'redux'

import {
    LOAD_SENSORS_FAILURE, LOAD_SENSORS_REQUEST, LOAD_SENSORS_SUCCESS,
} from '@/actions/sensors'
import { createReducer } from '@/utils'

export interface ISensorsModuleState {
    initialDataLoading: boolean
}

const initialState = {
    initialDataLoading: true,
}

const reducer = createReducer<ISensorsModuleState>([
    [LOAD_SENSORS_REQUEST, (state) => ({
        ...state,
    })],
    [LOAD_SENSORS_SUCCESS, (state) => ({
        ...state,
        initialDataLoading: false,
    })],
    [LOAD_SENSORS_FAILURE, (state) => ({
        ...state,
        initialDataLoading: false,
    })],
])

const sensorsModuleReducer: Reducer<ISensorsModuleState> = (state = initialState, action) => reducer(state, action)

export default sensorsModuleReducer
