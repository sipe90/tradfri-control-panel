
import { message } from 'antd'
import * as R from 'ramda'

import { change } from 'redux-form'

import { GATEWAY_WIZARD_FORM } from '@/containers/gateway/GatewayWizardFormContainer'
import { IConnectionTestResult, ThunkResult } from '@/types'
import { fetchDeleteJson, fetchGetJson, fetchPostJson } from '@/utils'
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

export const DELETE_GATEWAY_REQUEST = 'DELETE_GATEWAY_REQUEST'
export const DELETE_GATEWAY_SUCCESS = 'DELETE_GATEWAY_SUCCESS'
export const DELETE_GATEWAY_FAILURE = 'DELETE_GATEWAY_FAILURE'

export const REBOOT_GATEWAY_REQUEST = 'REBOOT_GATEWAY_REQUEST'
export const REBOOT_GATEWAY_SUCCESS = 'REBOOT_GATEWAY_SUCCESS'
export const REBOOT_GATEWAY_FAILURE = 'REBOOT_GATEWAY_FAILURE'

export const RESET_GATEWAY_SUCCESS = 'RESET_GATEWAY_SUCCESS'
export const RESET_GATEWAY_REQUEST = 'RESET_GATEWAY_REQUEST'
export const RESET_GATEWAY_FAILURE = 'RESET_GATEWAY_FAILURE'

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

const deleteGatewayRequest = () => ({
    type: DELETE_GATEWAY_REQUEST
})

const deleteGatewaySuccess = () => ({
    type: DELETE_GATEWAY_SUCCESS
})

const deleteGatewayFailure = (error: Error) => ({
    type: DELETE_GATEWAY_FAILURE,
    payload: error
})

const rebootGatewayRequest = () => ({
    type: REBOOT_GATEWAY_REQUEST
})

const rebootGatewaySuccess = () => ({
    type: REBOOT_GATEWAY_SUCCESS
})

const rebootGatewayFailure = (error: Error) => ({
    type: REBOOT_GATEWAY_FAILURE,
    payload: error
})

const resetGatewayRequest = () => ({
    type: RESET_GATEWAY_REQUEST
})

const resetGatewaySuccess = () => ({
    type: RESET_GATEWAY_SUCCESS
})

const resetGatewayFailure = (error: Error) => ({
    type: RESET_GATEWAY_FAILURE,
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

export const fetchGateway: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        dispatch(loadGatewayRequest())
        const res = await fetchGetJson<IGateway>('/api/gateway')

        if (res.status === 404) {
            dispatch(loadGatewaySuccess(null))
            return
        }

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(loadGatewaySuccess(res.json))
    } catch (error) {
        message.error(`Failed to fetch gateway: ${error.message}`)
        dispatch(loadGatewayFailure(error))
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
        message.error(`Failed to save gateway: ${error.message}`)
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
        message.error(`Failed to update gateway: ${error.message}`)
        dispatch(updateGatewayFailure(error))
    }
}

export const deleteGateway: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        dispatch(deleteGatewayRequest())
        const res = await fetchDeleteJson<void>('/api/gateway')

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(deleteGatewaySuccess())
        dispatch(fetchGateway())
    } catch (error) {
        message.error(`Failed to delete gateway: ${error.message}`)
        dispatch(deleteGatewayFailure(error))
    }
}

export const rebootGateway: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        dispatch(rebootGatewayRequest())
        const res = await fetchPostJson<void>('/api/gateway/reboot')

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(rebootGatewaySuccess())
    } catch (error) {
        message.error(`Failed to reboot gateway: ${error.message}`)
        dispatch(rebootGatewayFailure(error))
    }
}

export const resetGateway: ActionCreator<ThunkResult> = () => async (dispatch) => {
    try {
        dispatch(resetGatewayRequest())
        const res = await fetchPostJson<void>('/api/gateway/reset')

        if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

        dispatch(resetGatewaySuccess())
        dispatch(fetchGateway())
    } catch (error) {
        message.error(`Failed to reset gateway: ${error.message}`)
        dispatch(resetGatewayFailure(error))
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

        dispatch(change(GATEWAY_WIZARD_FORM, 'name', name))
        dispatch(change(GATEWAY_WIZARD_FORM, 'hostname', addresses[0]))
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

            dispatch(change(GATEWAY_WIZARD_FORM, 'identity', identity))
            dispatch(change(GATEWAY_WIZARD_FORM, 'psk', psk))
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
