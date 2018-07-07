
export const LOAD_LIGHTS_REQUEST = 'LOAD_LIGHTS_REQUEST'
export const LOAD_LIGHTS_SUCCESS = 'LOAD_LIGHTS_SUCCESS'
export const LOAD_LIGHTS_FAILURE = 'LOAD_LIGHTS_FAILURE'

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
        .catch(error => dispatch(loadLightsFailure(error)))
}
