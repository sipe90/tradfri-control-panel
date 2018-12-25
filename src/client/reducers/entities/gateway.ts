import { LOAD_GATEWAY_SUCCESS } from '@/actions/gateway'
import { Reducer } from 'redux'
import { Gateway } from 'shared/types'
import { createReducer } from '@/utils';

const initialState = null

type GatewayEntityState = Gateway | null;

const reducer = createReducer<GatewayEntityState>([
    [LOAD_GATEWAY_SUCCESS, (_state, { payload }) => payload ? ({
        ...payload
    }) : null],
])

const gatewayEntityReducer: Reducer<GatewayEntityState> = (state = initialState, action) => reducer(state, action)

export default gatewayEntityReducer
