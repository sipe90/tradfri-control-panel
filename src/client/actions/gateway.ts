
import { message } from 'antd'
import * as R from 'ramda'

import { change } from 'redux-form'

import { START_TIMER, STOP_TIMER } from '@/redux-timers'
import { IConnectionTestResult, ThunkResult } from '@/types'
import { fetchGetJson, fetchPostJson } from '@/utils'
import { DiscoveredGateway } from 'node-tradfri-client'
import { ActionCreator } from 'redux'
import { IGateway } from 'shared/types'

export const LOAD_GATEWAY_REQUEST = 'LOAD_GATEWAY_REQUEST'
export const LOAD_GATEWAY_SUCCESS = 'LOAD_GATEWAY_SUCCESS'
export const LOAD_GATEWAY_FAILURE = 'LOAD_GATEWAY_FAILURE'

export const SAVE_GATEWAY_REQUEST = 'SAVE_GATEWAY_REQUEST'
export const SAVE_GATEWAY_SUCCESS = 'SAVE_GATEWAY_SUCCESS'
export const SAVE_GATEWAY_FAILURE = 'SAVE_GATEWAY_FAILURE'

export const UPDATE_GATEWAY_REQUEST = 'UPDATE_GATEWAY_REQUEST'
export const UPDATE_GATEWAY_SUCCESS = 'UPDATE_GATEWAY_SUCCESS'
export const UPDATE_GATEWAY_FAILURE = 'UPDATE_GATEWAY_FAILURE'

export const GATEWAY_STATE_CHANGED = 'GATEWAY_STATE_CHANGED'

export const DISCOVER_GATEWAY_REQUEST = 'DISCOVER_GATEWAY_REQUEST'
export const DISCOVER_GATEWAY_SUCCESS = 'DISCOVER_GATEWAY_SUCCESS'
export const DISCOVER_GATEWAY_FAILURE = 'DISCOVER_GATEWAY_FAILURE'

export const GENERATE_IDENTITY_REQUEST = 'GENERATE_IDENTITY_REQUEST'
export const GENERATE_IDENTITY_SUCCESS = 'GENERATE_IDENTITY_SUCCESS'
export const GENERATE_IDENTITY_FAILURE = 'GENERATE_IDENTITY_FAILURE'

export const TEST_CONNECTION_REQUEST = 'TEST_CONNECTION_REQUEST'
export const TEST_CONNECTION_SUCCESS = 'TEST_CONNECTION_SUCCESS'
export const TEST_CONNECTION_FAILURE = 'TEST_CONNECTION_FAILURE'

const loadGatewayRequest = () => ({
    type: LOAD_GATEWAY_REQUEST
})

const loadGatewaySuccess = (gateway: IGateway | null) => ({
    type: LOAD_GATEWAY_SUCCESS,
    payload: gateway
})

const loadGatewayFailure = (error: Error) => ({
    type: LOAD_GATEWAY_FAILURE,
    payload: error
})

const saveGatewayRequest = () => ({
    type: SAVE_GATEWAY_REQUEST
})

const saveGatewaySuccess = () => ({
    type: SAVE_GATEWAY_SUCCESS
})

const saveGatewayFailure = (error: Error) => ({
    type: SAVE_GATEWAY_FAILURE,
    payload: error
})

const updateGatewayRequest = () => ({
    type: UPDATE_GATEWAY_REQUEST
})

const updateGatewaySuccess = () => ({
    type: UPDATE_GATEWAY_SUCCESS
})

const updateGatewayFailure = (error: Error) => ({
    type: UPDATE_GATEWAY_FAILURE,
    payload: error
})

const discoverGatewayRequest = () => ({
    type: DISCOVER_GATEWAY_REQUEST
})

const discoverGatewaySuccess = (discoveredGateway: DiscoveredGateway | null) => ({
    type: DISCOVER_GATEWAY_SUCCESS,
    payload: discoveredGateway
})

const discoverGatewayFailure = () => ({
    type: DISCOVER_GATEWAY_FAILURE
})

const generateIdentityRequest = () => ({
    type: GENERATE_IDENTITY_REQUEST
})

const generateIdentitySuccess = () => ({
    type: GENERATE_IDENTITY_SUCCESS
})

const generateIdentityFailure = (error: Error) => ({
    type: GENERATE_IDENTITY_FAILURE,
    payload: error
})

const testConnectionRequest = () => ({
    type: TEST_CONNECTION_REQUEST
})

const testConnectionSuccess = (testResult: IConnectionTestResult) => ({
    type: TEST_CONNECTION_SUCCESS,
    payload: testResult
})

const testConnectionFailure = (error: Error) => ({
    type: TEST_CONNECTION_FAILURE,
    payload: error
})

export const gatewayStateChanged = (gatewayProps: IGateway) => ({
    type: GATEWAY_STATE_CHANGED,
    payload: gatewayProps
})

export const startGatewayPolling: ActionCreator<ThunkResult> = () => (dispatch) =>
    dispatch({
        type: START_TIMER,
        payload: {
            timerName: 'pollGateway',
            dispatchFunc: fetchGateway(),
            timerInterval: 30000
        }
    })

export const stopGatewayPolling: ActionCreator<ThunkResult> = () => (dispatch) =>
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollGateway'
        }
    })

export const fetchGateway: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        dispatch(loadGatewayRequest())
        const res = await fetchGetJson<IGateway>('/api/gateway')

        if (res.status === 404) {
            dispatch(loadGatewaySuccess(null))
            dispatch(stopGatewayPolling())
            return
        }

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(loadGatewaySuccess(res.json))
    } catch (error) {
        message.error(`Failed to fetch gateway: ${error.message}`)
        dispatch(loadGatewayFailure(error))
        dispatch(stopGatewayPolling())
    }
}

export const saveGateway: ActionCreator<ThunkResult> = (gateway: IGateway) => async (dispatch) => {
    try {
        dispatch(saveGatewayRequest())
        const res = await fetchPostJson<void>('/api/gateway', gateway)

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(saveGatewaySuccess())
        dispatch(fetchGateway())
    } catch (error) {
        message.error(`Failed to save or update gateway: ${error.message}`)
        dispatch(saveGatewayFailure(error))
    }
}

export const updateGateway: ActionCreator<ThunkResult> = (gateway: Partial<IGateway>) => async (dispatch) => {
    try {
        dispatch(updateGatewayRequest())
        const res = await fetchPostJson<void>('/api/gateway/update', gateway)

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(updateGatewaySuccess())
        dispatch(fetchGateway())
    } catch (error) {
        message.error(`Failed to save or update gateway: ${error.message}`)
        dispatch(updateGatewayFailure(error))
    }
}

export const discoverGateway: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        dispatch(discoverGatewayRequest())
        const res = await fetchGetJson<DiscoveredGateway>('api/gateway/discover')

        if (res.status === 404) {
            dispatch(discoverGatewaySuccess(null))
            return
        }

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        const { name, addresses } = res.json

        dispatch(change('GATEWAY', 'name', name))
        dispatch(change('GATEWAY', 'hostname', addresses[0]))
        dispatch(discoverGatewaySuccess(res.json))
    } catch (error) {
        message.error(`Failed to discover gateway: ${error.message}`)
        dispatch(discoverGatewayFailure())
    }
}

interface IGenerateIdentityResponse {
    identity: string
    psk: string
}

export const generateIdentity: ActionCreator<ThunkResult> = (hostname: string, securityCode: string) =>
    async (dispatch) => {
        try {
            dispatch(generateIdentityRequest())
            const res = await fetchPostJson<IGenerateIdentityResponse>(
                'api/gateway/identity', { hostname, securityCode })

            if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

            const { identity, psk } = res.json

            dispatch(change('GATEWAY', 'identity', identity))
            dispatch(change('GATEWAY', 'psk', psk))
            dispatch(generateIdentitySuccess())
        } catch (error) {
            message.error(`Failed to generate identity: ${error.message}`)
            dispatch(generateIdentityFailure(error))
        }
}

export const testConnection: ActionCreator<ThunkResult> = (hostname: string, identity: string, psk: string) =>
    async (dispatch) => {
        try {
            dispatch(testConnectionRequest())
            const res = await fetchPostJson<IConnectionTestResult>('/api/gateway/test', { hostname, identity, psk })

            if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

            dispatch(testConnectionSuccess(res.json))
        } catch (error) {
            message.error(`Failed to test connection: ${error.message}`)
            dispatch(testConnectionFailure(error))
        }
}
