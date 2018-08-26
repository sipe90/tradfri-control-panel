
import { message } from 'antd'

import { START_TIMER, STOP_TIMER } from 'redux-timers'

export const LOAD_GATEWAYS_REQUEST = 'LOAD_GATEWAYS_REQUEST'
export const LOAD_GATEWAYS_SUCCESS = 'LOAD_GATEWAYS_SUCCESS'
export const LOAD_GATEWAYS_FAILURE = 'LOAD_GATEWAYS_FAILURE'

export const UPDATE_GATEWAY_REQUEST = 'UPDATE_GATEWAY_REQUEST'
export const UPDATE_GATEWAY_SUCCESS = 'UPDATE_GATEWAY_SUCCESS'
export const UPDATE_GATEWAY_FAILURE = 'UPDATE_GATEWAY_FAILURE'

export const GATEWAY_STATE_CHANGED = 'GATEWAY_STATE_CHANGED'

const loadGatewaysRequest = () => ({
    type: LOAD_GATEWAYS_REQUEST
})

const loadGatewaysSuccess = (gateways) => ({
    type: LOAD_GATEWAYS_SUCCESS,
    payload: gateways
})

const loadGatewaysFailure = (error) => ({
    type: LOAD_GATEWAYS_FAILURE,
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
            timerName: 'pollGateways',
            dispatchFunc: fetchGateways(),
            timerInterval: 30000 
        }
    })


export const stopGatewayPolling = () => (dispatch) => 
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollGateways'
        }
    })


export const fetchGateways = () => (dispatch) => {

    dispatch(loadGatewaysRequest())

    return fetch('/api/gateways')
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(loadGatewaysSuccess(json)))
        .catch(error => { 
            message.error(error.message)
            dispatch(loadGatewaysFailure(error))
        })
}

export const updateGateway = (gateway) => (dispatch) => {

    dispatch(updateGatewayRequest())

    return fetch(`/api/gateways/${gateway.id}`, 
        { method: 'POST', body: JSON.stringify(gateway), headers: { 'content-type': 'application/json'}})
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(updateGatewaySuccess(json)))
        .catch(error => {
            message.error(error.message)
            dispatch(updateGatewayFailure(error))
        })
}
