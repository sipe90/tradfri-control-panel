import {
    LOAD_GATEWAY_REQUEST, LOAD_GATEWAY_SUCCESS, LOAD_GATEWAY_FAILURE,
    DISCOVER_GATEWAY_REQUEST, DISCOVER_GATEWAY_SUCCESS, DISCOVER_GATEWAY_FAILURE,
    GENERATE_IDENTITY_REQUEST, GENERATE_IDENTITY_SUCCESS, GENERATE_IDENTITY_FAILURE,
    TEST_CONNECTION_REQUEST, TEST_CONNECTION_SUCCESS, TEST_CONNECTION_FAILURE
} from 'actions/gateway'
import { Gateway } from 'shared/types'
import { Reducer } from 'redux'
import { ErrorResponse, ConnectionTestResult } from 'types'
import { createReducer } from 'utils'

interface GatewayModuleState {
    initialDataLoading: boolean
    discoveryInProgress: boolean
    identityGenerationInProgress: boolean
    connectionTestInProgress: boolean
    discoveredGateway: Gateway | null
    identityGenerationError: ErrorResponse | null
    connectionTestResult: ConnectionTestResult | null
}

const initialState = {
    initialDataLoading: false,
    discoveryInProgress: false,
    identityGenerationInProgress: false,
    connectionTestInProgress: false,
    discoveredGateway: null,
    identityGenerationError: null,
    connectionTestResult: null
}

const reducer = createReducer<GatewayModuleState>([
    [LOAD_GATEWAY_REQUEST, (state) => ({
        ...state,
        initialDataLoading: true
    })],
    [LOAD_GATEWAY_SUCCESS, (state) => ({
        ...state,
        initialDataLoading: false
    })],
    [LOAD_GATEWAY_FAILURE, (state) => ({
        ...state,
        initialDataLoading: false
    })],
    [DISCOVER_GATEWAY_REQUEST, (state) => ({
        ...state,
        discoveryInProgress: true
    })],
    [DISCOVER_GATEWAY_SUCCESS, (state, { payload }) => ({
        ...state,
        discoveryInProgress: false,
        discoveredGateway: payload
    })],
    [DISCOVER_GATEWAY_FAILURE, state => ({
        ...state,
        discoveryInProgress: false,
        discoveredGateway: null
    })],
    [GENERATE_IDENTITY_REQUEST, (state) => ({
        ...state,
        identityGenerationInProgress: true
    })],
    [GENERATE_IDENTITY_SUCCESS, (state) => ({
        ...state,
        identityGenerationInProgress: false,
        identityGenerationError: null
    })],
    [GENERATE_IDENTITY_FAILURE, (state, { payload }) => ({
        ...state,
        identityGenerationInProgress: false,
        identityGenerationError: payload
    })],
    [TEST_CONNECTION_REQUEST, (state) => ({
        ...state,
        connectionTestInProgress: true,
        connectionTestResult: null
    })],
    [TEST_CONNECTION_SUCCESS, (state, { payload }) => ({
        ...state,
        connectionTestInProgress: false,
        connectionTestResult: payload
    })],
    [TEST_CONNECTION_FAILURE, (state, { payload }) => ({
        ...state,
        connectionTestInProgress: false,
        connectionTestResult: payload
    })]
])

const gatewayReducer: Reducer<GatewayModuleState> = (state = initialState, action) => reducer(state, action)

export default gatewayReducer
