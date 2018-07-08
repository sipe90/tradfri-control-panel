
import { message } from 'antd'

export const LOAD_LIGHTS_REQUEST = 'LOAD_LIGHTS_REQUEST'
export const LOAD_LIGHTS_SUCCESS = 'LOAD_LIGHTS_SUCCESS'
export const LOAD_LIGHTS_FAILURE = 'LOAD_LIGHTS_FAILURE'

export const UPDATE_LIGHT_REQUEST = 'UPDATE_LIGHT_REQUEST'
export const UPDATE_LIGHT_SUCCESS = 'UPDATE_LIGHT_SUCCESS'
export const UPDATE_LIGHT_FAILURE = 'UPDATE_LIGHT_FAILURE'

export const loadLightsRequest = () => ({
    type: LOAD_LIGHTS_REQUEST
})

export const loadLightsSuccess = (lights) => ({
    type: LOAD_LIGHTS_SUCCESS,
    payload: lights
})

export const loadLightsFailure = (error) => ({
    type: LOAD_LIGHTS_FAILURE,
    payload: error
})

export const updateLightRequest = () => ({
    type: UPDATE_LIGHT_REQUEST
})

export const updateLightSuccess = () => ({
    type: UPDATE_LIGHT_SUCCESS
})

export const updateLightFailure = (error) => ({
    type: UPDATE_LIGHT_FAILURE,
    payload: error
})

const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return response
}

export const fetchLights = () => (dispatch) => {

    dispatch(loadLightsRequest())

    return fetch('/api/lights')
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
            dispatch(loadLightsSuccess(json))
            return json
        })
        .catch(error => message.error(error) || dispatch(loadLightsFailure(error)))
}

export const updateLight = (gatewayId, light) => (dispatch) => {

    dispatch(updateLightRequest())

    return fetch(`/api/gateways/${gatewayId}/lights/${light.id}`, 
        { method: 'POST', body: light, headers: { 'content-type': 'application/json'}})
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
            dispatch(updateLightSuccess(json))
            return json
        })
        .catch(error => message.error(error) || dispatch(updateLightFailure(error)))
}
