import { LOAD_GATEWAY_SUCCESS } from '#/actions/gateway'
import { ActionReducers, createReducer } from '#/utils'
import { Gateway } from '@tradfri-control-panel/shared'

const initialState = null

export type GatewayEntityState = Gateway | null

const reducers: ActionReducers<GatewayEntityState> = [
    [LOAD_GATEWAY_SUCCESS, (_state, { payload }) => payload || null],
]

export default createReducer(reducers, initialState)
