import { 
    LOAD_SENSORS_REQUEST, LOAD_SENSORS_SUCCESS, LOAD_SENSORS_FAILURE 
} from 'actions/sensors'
import { createReducer } from 'utils'
import { Reducer } from 'redux'

interface SensorsModuleState {
    initialDataLoading: boolean
}

const initialState = {
    initialDataLoading: true
}

const reducer = createReducer<SensorsModuleState>([
    [LOAD_SENSORS_REQUEST, (state) => ({ 
        ...state
    })],
    [LOAD_SENSORS_SUCCESS, (state) => ({ 
        ...state, 
        initialDataLoading: false
    })],
    [LOAD_SENSORS_FAILURE, (state) => ({
        ...state,
        initialDataLoading: false
    })]
])

const sensorsModuleReducer: Reducer<SensorsModuleState> = (state = initialState, action) => reducer(state, action) 

export default sensorsModuleReducer
