import { LOAD_GATEWAY_SUCCESS } from '@/actions/gateway'
import { ActionReducers, createReducer } from '@/utils'
import { IGateway } from 'shared/types'

const initialState = null

export type GatewayEntityState = IGateway | null

const reducers: ActionReducers<GatewayEntityState> = [
    [LOAD_GATEWAY_SUCCESS, (_state, { payload }) => payload || null],
]

export default createReducer(reducers, initialState)
