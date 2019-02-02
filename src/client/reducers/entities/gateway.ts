import { LOAD_GATEWAY_SUCCESS } from '@/actions/gateway'
import { createReducer } from '@/utils'
import { IGateway } from 'shared/types'

const initialState = null

export type GatewayEntityState = IGateway | null

export default createReducer<GatewayEntityState>([
    [LOAD_GATEWAY_SUCCESS, (_state, { payload }) => (payload ? {
        ...payload,
    } : null)],
], initialState)
