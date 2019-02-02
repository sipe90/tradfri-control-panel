import {
    LOAD_LIGHTS_FAILURE, LOAD_LIGHTS_REQUEST, LOAD_LIGHTS_SUCCESS,
} from '@/actions/lights'
import { createReducer } from '@/utils'

export interface ILightsModuleState {
    initialDataLoading: boolean
}

const initialState = {
    initialDataLoading: true,
}
export default createReducer<ILightsModuleState>([
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
], initialState)
