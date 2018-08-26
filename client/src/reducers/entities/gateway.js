
import * as R from 'ramda'

import { LOAD_GATEWAY_SUCCESS } from 'actions/gateway'

const initialState = null

const reducer = (previousState = initialState, { type, payload }) =>
    R.cond([
        [R.equals(LOAD_GATEWAY_SUCCESS), () => payload ? ({
            ...payload
        }) : null],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
