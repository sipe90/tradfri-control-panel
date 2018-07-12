
import * as R from 'ramda'

import { 
    LOAD_LIGHTS_REQUEST, LOAD_LIGHTS_SUCCESS, LOAD_LIGHTS_FAILURE, LIGHT_NAME_EDIT_CHANGED 
} from 'actions/lights'

const initialState = {
    initialDataLoading: true,
    nameEdit: {}
}

const updateNameEdit = (previousState, { lightId, name }) => ({
    nameEdit: {
        ...previousState.nameEdit,
        [lightId] : name
    }
})

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
        [R.equals(LIGHT_NAME_EDIT_CHANGED), () => ({ 
            ...previousState, 
            ...updateNameEdit(previousState, payload) 
        })],
        [R.T, R.always(previousState)]
    ])(type)

export default reducer
