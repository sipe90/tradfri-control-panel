import {
    LOAD_LIGHTS_FAILURE, LOAD_LIGHTS_REQUEST, LOAD_LIGHTS_SUCCESS,
} from '#/actions/lights'
import { ActionReducers, createReducer } from '#/utils'

export interface LightsModuleState {
    initialDataLoading: boolean
}

const initialState = {
    initialDataLoading: true,
}

const reducers: ActionReducers<LightsModuleState> = [
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
]

export default createReducer(reducers, initialState)
