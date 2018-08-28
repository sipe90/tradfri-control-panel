
import * as R from 'ramda'

import {
    LOAD_GATEWAY_REQUEST, LOAD_GATEWAY_SUCCESS, LOAD_GATEWAY_FAILURE,
    DISCOVER_GATEWAY_REQUEST, DISCOVER_GATEWAY_SUCCESS, DISCOVER_GATEWAY_FAILURE,
    GENERATE_IDENTITY_REQUEST, GENERATE_IDENTITY_SUCCESS, GENERATE_IDENTITY_FAILURE,
    TEST_CONNECTION_REQUEST, TEST_CONNECTION_SUCCESS, TEST_CONNECTION_FAILURE
} from 'actions/gateway'

const initialState = {
    initialDataLoading: false,
    discoveryInProgress: false,
    identityGenerationInProgress: false,
    connectionTestInProgress: false,
    discoveredGateway: null,
    identityGenerationError: null,
    connectionTestResult: null
}

const reducer = (previousState = initialState, { type, payload }) =>
    R.cond([
        [R.equals(LOAD_GATEWAY_REQUEST), () => ({
            ...previousState,
            initialDataLoading: true
        })],
        [R.equals(LOAD_GATEWAY_SUCCESS), () => ({
            ...previousState,
            initialDataLoading: false
        })],
        [R.equals(LOAD_GATEWAY_FAILURE), () => ({
            ...previousState,
            initialDataLoading: false
        })],
        [R.equals(DISCOVER_GATEWAY_REQUEST), () => ({
            ...previousState,
            discoveryInProgress: true
        })],
        [R.equals(DISCOVER_GATEWAY_SUCCESS), () => ({
            ...previousState,
            discoveryInProgress: false,
            discoveredGateway: payload
        })],
        [R.equals(DISCOVER_GATEWAY_FAILURE), () => ({
            ...previousState,
            discoveryInProgress: false,
            discoveredGateway: null
        })],
        [R.equals(GENERATE_IDENTITY_REQUEST), () => ({
            ...previousState,
            identityGenerationInProgress: true
        })],
        [R.equals(GENERATE_IDENTITY_SUCCESS), () => ({
            ...previousState,
            identityGenerationInProgress: false,
            identityGenerationError: null
        })],
        [R.equals(GENERATE_IDENTITY_FAILURE), () => ({
            ...previousState,
            identityGenerationInProgress: false,
            identityGenerationError: payload
        })],
        [R.equals(TEST_CONNECTION_REQUEST), () => ({
            ...previousState,
            connectionTestInProgress: true,
            connectionTestResult: null
        })],
        [R.equals(TEST_CONNECTION_SUCCESS), () => ({
            ...previousState,
            connectionTestInProgress: false,
            connectionTestResult: payload
        })],
        [R.equals(TEST_CONNECTION_FAILURE), () => ({
            ...previousState,
            connectionTestInProgress: false,
            connectionTestResult: null
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
