import {
    LOAD_GATEWAY_FAILURE, LOAD_GATEWAY_REQUEST, LOAD_GATEWAY_SUCCESS,
} from '#/actions/gateway'
import { ActionReducers, createReducer } from '#/utils'

export interface GatewayModuleState {
    initialDataLoading: boolean
}

const initialState: GatewayModuleState = {
    initialDataLoading: true,
}

const reducers: ActionReducers<GatewayModuleState> = [
    [LOAD_GATEWAY_REQUEST, (state) => ({
        ...state
    })],
    [LOAD_GATEWAY_SUCCESS, (state) => ({
        ...state,
        initialDataLoading: false,
    })],
    [LOAD_GATEWAY_FAILURE, (state) => ({
        ...state,
        initialDataLoading: false,
    })]
]

export default createReducer(reducers, initialState)
