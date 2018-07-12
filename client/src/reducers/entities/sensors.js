
import * as R from 'ramda'
import { normalize } from 'normalizr'

import schemas from 'schemas'

import { LOAD_SENSORS_SUCCESS, SENSOR_STATE_CHANGED } from 'actions/sensors'

const initialState = {}

const normalizeSensors = R.flip(normalize)(schemas.sensors)

const mapSensors = R.pipe(
    normalizeSensors,
    R.path(['entities', 'sensors'])
)

const updateSensor = (previousState, light) => ({
    ...previousState, 
    [light.id]: {
        ...previousState[light.id],
        ...light 
    }
})

const reducer = (previousState = initialState, { type, payload }) => 
    R.cond([
        [R.equals(LOAD_SENSORS_SUCCESS), () => ({  
            ...mapSensors(payload)
        })],
        [R.equals(SENSOR_STATE_CHANGED), () => ({
            ...previousState,
            ...updateSensor(previousState, payload)
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
