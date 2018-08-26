
import * as R from 'ramda'

import { 
    LOAD_GATEWAYS_REQUEST, LOAD_GATEWAYS_SUCCESS, LOAD_GATEWAYS_FAILURE 
} from 'actions/gateways'

const initialState = {
    initialDataLoading: true
}

const reducer = (previousState = initialState, { type, payload }) => 
    R.cond([
        [R.equals(LOAD_GATEWAYS_REQUEST), () => ({ 
            ...previousState
        })],
        [R.equals(LOAD_GATEWAYS_SUCCESS), () => ({ 
            ...previousState, 
            initialDataLoading: false
        })],
        [R.equals(LOAD_GATEWAYS_FAILURE), () => ({
            ...previousState,
            initialDataLoading: false
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
