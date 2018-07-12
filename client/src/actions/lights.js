
import { message } from 'antd'

import { fetchGateways } from 'actions/gateways'

import { START_TIMER, STOP_TIMER } from 'redux-timers'

export const LOAD_LIGHTS_REQUEST = 'LOAD_LIGHTS_REQUEST'
export const LOAD_LIGHTS_SUCCESS = 'LOAD_LIGHTS_SUCCESS'
export const LOAD_LIGHTS_FAILURE = 'LOAD_LIGHTS_FAILURE'

export const UPDATE_LIGHT_REQUEST = 'UPDATE_LIGHT_REQUEST'
export const UPDATE_LIGHT_SUCCESS = 'UPDATE_LIGHT_SUCCESS'
export const UPDATE_LIGHT_FAILURE = 'UPDATE_LIGHT_FAILURE'

export const LIGHT_STATE_CHANGED = 'LIGHT_STATE_CHANGED'

export const LIGHT_NAME_EDIT_CHANGED = 'LIGHT_NAME_EDIT_CHANGED'

const loadLightsRequest = () => ({
    type: LOAD_LIGHTS_REQUEST
})

const loadLightsSuccess = (lights) => ({
    type: LOAD_LIGHTS_SUCCESS,
    payload: lights
})

const loadLightsFailure = (error) => ({
    type: LOAD_LIGHTS_FAILURE,
    payload: error
})

const updateLightRequest = () => ({
    type: UPDATE_LIGHT_REQUEST
})

const updateLightSuccess = () => ({
    type: UPDATE_LIGHT_SUCCESS
})

const updateLightFailure = (error) => ({
    type: UPDATE_LIGHT_FAILURE,
    payload: error
})

export const lightStateChanged = (lightProps) => ({
    type: LIGHT_STATE_CHANGED,
    payload: lightProps
})

export const nameEditChanged = (lightId, name) => ({
    type: LIGHT_NAME_EDIT_CHANGED,
    payload: { lightId, name }
})

const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return response
}

export const startLightPolling = () => (dispatch) =>
    dispatch({
        type: START_TIMER,
        payload: {
            timerName: 'pollLights',
            dispatchFunc: fetchLights(),
            timerInterval: 5000 
        }
    })


export const stopLightPolling = () => (dispatch) => 
    dispatch({
        type: STOP_TIMER,
        payload: {
            timerName: 'pollLights'
        }
    })

export const fetchLights = () => (dispatch) =>
    dispatch(fetchGateways())
        .then(() => dispatch(loadLightsRequest()))
        .then(() => fetch('/api/lights'))
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(loadLightsSuccess(json)))
        .catch(error => { 
            message.error(error.message)
            dispatch(loadLightsFailure(error))
        })

export const updateLight = (gatewayId, light) => (dispatch) => {

    dispatch(updateLightRequest())

    return fetch(`/api/gateways/${gatewayId}/lights/${light.id}`, 
        { method: 'POST', body: light, headers: { 'content-type': 'application/json'}})
        .then(handleErrors)
        .then(res => res.json())
        .then(json => dispatch(updateLightSuccess(json)))
        .catch(error => {
            message.error(error.message)
            dispatch(updateLightFailure(error))
        })
}
