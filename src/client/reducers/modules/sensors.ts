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

export default createReducer<ISensorsModuleState>([
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
], initialState)
