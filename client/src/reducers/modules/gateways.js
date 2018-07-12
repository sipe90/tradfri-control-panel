
import * as R from 'ramda'

import { 
    LOAD_GATEWAYS_REQUEST, LOAD_GATEWAYS_SUCCESS, LOAD_GATEWAYS_FAILURE, GATEWAY_NAME_EDIT_CHANGED 
} from 'actions/gateways'

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
        [R.equals(GATEWAY_NAME_EDIT_CHANGED), () => ({ 
            ...previousState, 
            ...updateNameEdit(previousState, payload) 
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
