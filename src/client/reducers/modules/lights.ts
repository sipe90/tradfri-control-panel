import { 
    LOAD_LIGHTS_REQUEST, LOAD_LIGHTS_SUCCESS, LOAD_LIGHTS_FAILURE 
} from '@/actions/lights'
import { createReducer } from '@/utils'
import { Reducer } from 'redux'

interface LightsModuleState {
    initialDataLoading: boolean
}

const initialState = {
    initialDataLoading: true
}

const reducer = createReducer<LightsModuleState>([
    [LOAD_LIGHTS_REQUEST, (state) => ({ 
        ...state
    })],
    [LOAD_LIGHTS_SUCCESS, (state) => ({ 
        ...state, 
        initialDataLoading: false
    })],
    [LOAD_LIGHTS_FAILURE, (state) => ({
        ...state,
        initialDataLoading: false
    })]
])

const lightsModuleReducer: Reducer<LightsModuleState> = (state = initialState, action) => reducer(state, action);

export default lightsModuleReducer
