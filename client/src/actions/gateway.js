
import { message } from 'antd'

import { START_TIMER, STOP_TIMER } from 'redux-timers'

export const LOAD_GATEWAY_REQUEST = 'LOAD_GATEWAY_REQUEST'
export const LOAD_GATEWAY_SUCCESS = 'LOAD_GATEWAY_SUCCESS'
export const LOAD_GATEWAY_FAILURE = 'LOAD_GATEWAY_FAILURE'

export const UPDATE_GATEWAY_REQUEST = 'UPDATE_GATEWAY_REQUEST'
export const UPDATE_GATEWAY_SUCCESS = 'UPDATE_GATEWAY_SUCCESS'
export const UPDATE_GATEWAY_FAILURE = 'UPDATE_GATEWAY_FAILURE'

export const GATEWAY_STATE_CHANGED = 'GATEWAY_STATE_CHANGED'

const loadGatewayRequest = () => ({
    type: LOAD_GATEWAY_REQUEST
})

const loadGatewaySuccess = (gateway) => ({
    type: LOAD_GATEWAY_SUCCESS,
    payload: gateway
})

const loadGatewayFailure = (error) => ({
    type: LOAD_GATEWAY_FAILURE,
    payload: error
})

const updateGatewayRequest = () => ({
    type: UPDATE_GATEWAY_REQUEST
})

const updateGatewaySuccess = () => ({
    type: UPDATE_GATEWAY_SUCCESS
})

const updateGatewayFailure = (error) => ({
    type: UPDATE_GATEWAY_FAILURE,
    payload: error
})

export const gatewayStateChanged = (gatewayProps) => ({
    type: GATEWAY_STATE_CHANGED,
    payload: gatewayProps
})

const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return response
}

export const startGatewayPolling = () => (dispatch) =>
    dispatch({
        type: START_TIMER,
        payload: {
            timerName: 'pollGateway',
            dispatchFunc: fetchGateway(),
            timerInterval: 30000
        }
    })


export const stopGatewayPolling = () => (dispatch) =>
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollGateway'
        }
    })


export const fetchGateway = () => (dispatch) => {

    dispatch(loadGatewayRequest())

    return fetch('/api/gateway')
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(loadGatewaySuccess(json)))
        .catch(error => {
            message.error(error.message)
            dispatch(loadGatewayFailure(error))
        })
}

export const updateGateway = (gateway) => (dispatch) => {

    dispatch(updateGatewayRequest())

    return fetch('/api/gateway',
        { method: 'POST', body: JSON.stringify(gateway), headers: { 'content-type': 'application/json' } })
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(updateGatewaySuccess(json)))
        .catch(error => {
            message.error(error.message)
            dispatch(updateGatewayFailure(error))
        })
}
