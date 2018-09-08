
import * as R from 'ramda'

import { 
    LOAD_LIGHTS_REQUEST, LOAD_LIGHTS_SUCCESS, LOAD_LIGHTS_FAILURE 
} from 'actions/lights'

const initialState = {
    initialDataLoading: true
}

const reducer = (previousState = initialState, { type, payload }) => 
    R.cond([
        [R.equals(LOAD_LIGHTS_REQUEST), () => ({ 
            ...previousState
        })],
        [R.equals(LOAD_LIGHTS_SUCCESS), () => ({ 
            ...previousState, 
            initialDataLoading: false
        })],
        [R.equals(LOAD_LIGHTS_FAILURE), () => ({
            ...previousState,
            initialDataLoading: false
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
