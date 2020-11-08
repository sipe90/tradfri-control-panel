import {
    LOAD_SENSORS_FAILURE, LOAD_SENSORS_REQUEST, LOAD_SENSORS_SUCCESS,
} from '#/actions/sensors'
import { ActionReducers, createReducer } from '#/utils'

export interface SensorsModuleState {
    initialDataLoading: boolean
}

const initialState = {
    initialDataLoading: true,
}

const reducers: ActionReducers<SensorsModuleState> = [
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
]

export default createReducer(reducers, initialState)
