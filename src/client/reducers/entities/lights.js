
import * as R from 'ramda'
import { normalize } from 'normalizr'

import schemas from 'schemas'

import { LOAD_LIGHTS_SUCCESS, LIGHT_STATE_CHANGED } from 'actions/lights'

const initialState = {}

const normalizeLights = R.flip(normalize)(schemas.lights)

const mapLights = R.pipe(
    normalizeLights,
    R.path(['entities', 'lights'])
)

const updateLight = (previousState, light) => ({
    ...previousState, 
    [light.id]: {
        ...previousState[light.id],
        ...light 
    }
})

const reducer = (previousState = initialState, { type, payload }) => 
    R.cond([
        [R.equals(LOAD_LIGHTS_SUCCESS), () => ({  
            ...mapLights(payload)
        })],
        [R.equals(LIGHT_STATE_CHANGED), () => ({
            ...previousState,
            ...updateLight(previousState, payload)
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
