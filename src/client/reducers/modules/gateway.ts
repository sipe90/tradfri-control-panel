import { Reducer } from 'redux'

import {
    DISCOVER_GATEWAY_FAILURE, DISCOVER_GATEWAY_REQUEST, DISCOVER_GATEWAY_SUCCESS,
    GENERATE_IDENTITY_FAILURE, GENERATE_IDENTITY_REQUEST, GENERATE_IDENTITY_SUCCESS,
    LOAD_GATEWAY_FAILURE, LOAD_GATEWAY_REQUEST, LOAD_GATEWAY_SUCCESS,
    TEST_CONNECTION_FAILURE, TEST_CONNECTION_REQUEST, TEST_CONNECTION_SUCCESS,
} from '@/actions/gateway'
import { IConnectionTestResult, IErrorResponse } from '@/types'
import { createReducer } from '@/utils'
import { Gateway } from 'shared/types'

interface IGatewayModuleState {
    initialDataLoading: boolean
    discoveryInProgress: boolean
    identityGenerationInProgress: boolean
    connectionTestInProgress: boolean
    discoveredGateway: Gateway | null
    identityGenerationError: IErrorResponse | null
    connectionTestResult: IConnectionTestResult | null
}

const initialState = {
    connectionTestInProgress: false,
    connectionTestResult: null,
    discoveredGateway: null,
    discoveryInProgress: false,
    identityGenerationError: null,
    identityGenerationInProgress: false,
    initialDataLoading: false,
}

const reducer = createReducer<IGatewayModuleState>([
    [LOAD_GATEWAY_REQUEST, (state) => ({
        ...state,
        initialDataLoading: true,
    })],
    [LOAD_GATEWAY_SUCCESS, (state) => ({
        ...state,
        initialDataLoading: false,
    })],
    [LOAD_GATEWAY_FAILURE, (state) => ({
        ...state,
        initialDataLoading: false,
    })],
    [DISCOVER_GATEWAY_REQUEST, (state) => ({
        ...state,
        discoveryInProgress: true,
    })],
    [DISCOVER_GATEWAY_SUCCESS, (state, { payload }) => ({
        ...state,
        discoveredGateway: payload,
        discoveryInProgress: false,
    })],
    [DISCOVER_GATEWAY_FAILURE, (state) => ({
        ...state,
        discoveredGateway: null,
        discoveryInProgress: false,
    })],
    [GENERATE_IDENTITY_REQUEST, (state) => ({
        ...state,
        identityGenerationInProgress: true,
    })],
    [GENERATE_IDENTITY_SUCCESS, (state) => ({
        ...state,
        identityGenerationError: null,
        identityGenerationInProgress: false,
    })],
    [GENERATE_IDENTITY_FAILURE, (state, { payload }) => ({
        ...state,
        identityGenerationError: payload,
        identityGenerationInProgress: false,
    })],
    [TEST_CONNECTION_REQUEST, (state) => ({
        ...state,
        connectionTestInProgress: true,
        connectionTestResult: null,
    })],
    [TEST_CONNECTION_SUCCESS, (state, { payload }) => ({
        ...state,
        connectionTestInProgress: false,
        connectionTestResult: payload,
    })],
    [TEST_CONNECTION_FAILURE, (state, { payload }) => ({
        ...state,
        connectionTestInProgress: false,
        connectionTestResult: payload,
    })],
])

const gatewayReducer: Reducer<IGatewayModuleState> = (state = initialState, action) => reducer(state, action)

export default gatewayReducer
