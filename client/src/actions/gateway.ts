
import { message } from 'antd'
import * as R from 'ramda'

import { AsyncThunkResult } from '@/types'
import { fetchDeleteJson, fetchGetJson, fetchPostJson } from '@/utils'
import { ActionCreator } from 'redux'
import { Gateway } from '@tradfri-control-panel/shared'

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

const loadGatewayRequest = () => ({
    type: LOAD_GATEWAY_REQUEST
})

const loadGatewaySuccess = (gateway: Gateway | null) => ({
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

export const fetchGateway: ActionCreator<AsyncThunkResult> = () => async (dispatch) => {
    try {
        dispatch(loadGatewayRequest())
        const res = await fetchGetJson<Gateway>('/api/gateway')

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

export const saveGateway: ActionCreator<AsyncThunkResult> = (gateway: Gateway) => async (dispatch) => {
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

export const updateGateway: ActionCreator<AsyncThunkResult> = (gateway: Partial<Gateway>) => async (dispatch) => {
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

export const deleteGateway: ActionCreator<AsyncThunkResult> = () => async (dispatch) => {
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

export const rebootGateway: ActionCreator<AsyncThunkResult> = () => async (dispatch) => {
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

export const resetGateway: ActionCreator<AsyncThunkResult> = () => async (dispatch) => {
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
