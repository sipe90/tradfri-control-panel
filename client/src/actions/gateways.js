
import { message } from 'antd'

import { START_TIMER, STOP_TIMER } from 'redux-timers'

export const LOAD_GATEWAYS_REQUEST = 'LOAD_GATEWAYS_REQUEST'
export const LOAD_GATEWAYS_SUCCESS = 'LOAD_GATEWAYS_SUCCESS'
export const LOAD_GATEWAYS_FAILURE = 'LOAD_GATEWAYS_FAILURE'

const loadGatewaysRequest = () => ({
    type: LOAD_GATEWAYS_REQUEST
})

const loadGatewaysSuccess = (lights) => ({
    type: LOAD_GATEWAYS_SUCCESS,
    payload: lights
})

const loadGatewaysFailure = (error) => ({
    type: LOAD_GATEWAYS_FAILURE,
    payload: error
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
            timerInterval: 5000 
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
