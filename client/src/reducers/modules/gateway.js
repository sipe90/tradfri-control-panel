
import * as R from 'ramda'

import {
    LOAD_GATEWAY_REQUEST, LOAD_GATEWAY_SUCCESS, LOAD_GATEWAY_FAILURE
} from 'actions/gateway'

const initialState = {
    initialDataLoading: true
}

const reducer = (previousState = initialState, { type, payload }) =>
    R.cond([
        [R.equals(LOAD_GATEWAY_REQUEST), () => ({
            ...previousState
        })],
        [R.equals(LOAD_GATEWAY_SUCCESS), () => ({
            ...previousState,
            initialDataLoading: false
        })],
        [R.equals(LOAD_GATEWAY_FAILURE), () => ({
            ...previousState,
            initialDataLoading: false
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
