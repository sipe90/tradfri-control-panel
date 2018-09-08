
import * as R from 'ramda'

import { 
    LOAD_SENSORS_REQUEST, LOAD_SENSORS_SUCCESS, LOAD_SENSORS_FAILURE 
} from 'actions/sensors'

const initialState = {
    initialDataLoading: true
}

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
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
