
import * as R from 'ramda'

import { 
    LOAD_SENSORS_REQUEST, LOAD_SENSORS_SUCCESS, LOAD_SENSORS_FAILURE, SENSOR_NAME_EDIT_CHANGED 
} from 'actions/sensors'

const initialState = {
    initialDataLoading: true,
    nameEdit: {}
}

const updateNameEdit = (previousState, { sensorId, name }) => ({
    nameEdit: {
        ...previousState.nameEdit,
        [sensorId] : name
    }
})

const reducer = (previousState = initialState, { type, payload }) => 
    R.cond([
        [R.equals(LOAD_SENSORS_REQUEST), () => ({ 
            ...previousState
        })],
        [R.equals(LOAD_SENSORS_SUCCESS), () => ({ 
            ...previousState, 
            initialDataLoading: false
        })],
        [R.equals(LOAD_SENSORS_FAILURE), () => ({
            ...previousState,
            initialDataLoading: false
        })],
        [R.equals(SENSOR_NAME_EDIT_CHANGED), () => ({ 
            ...previousState, 
            ...updateNameEdit(previousState, payload) 
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
