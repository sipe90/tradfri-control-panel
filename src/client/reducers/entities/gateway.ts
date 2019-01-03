import { Reducer } from 'redux'

import { LOAD_GATEWAY_SUCCESS } from '@/actions/gateway'
import { createReducer } from '@/utils'
import { IGateway } from 'shared/types'

const initialState = null

export type GatewayEntityState = IGateway | null

const reducer = createReducer<GatewayEntityState>([
    [LOAD_GATEWAY_SUCCESS, (_state, { payload }) => ({
        ...payload,
    })],
])

const gatewayEntityReducer: Reducer<GatewayEntityState> = (state = initialState, action) => reducer(state, action)

export default gatewayEntityReducer
