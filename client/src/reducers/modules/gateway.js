
import * as R from 'ramda'

import {
    LOAD_GATEWAY_REQUEST, LOAD_GATEWAY_SUCCESS, LOAD_GATEWAY_FAILURE,
    DISCOVER_GATEWAY_REQUEST, DISCOVER_GATEWAY_SUCCESS, DISCOVER_GATEWAY_FAILURE,
    GENERATE_IDENTITY_REQUEST, GENERATE_IDENTITY_SUCCESS, GENERATE_IDENTITY_FAILURE
} from 'actions/gateway'

const initialState = {
    initialDataLoading: false,
    discoveryInProgress: false,
    identityGenerationInProgress: false,
    discoveredGateway: null,
    identityGenerationError: null
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
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
