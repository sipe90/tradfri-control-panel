import * as R from 'ramda'

import { LIGHT_STATE_CHANGED, LOAD_LIGHTS_SUCCESS } from '@/actions/lights'
import { ActionReducers, createReducer } from '@/utils'
import { Dictionary, Light } from '@tradfri-control-panel/shared'

export type LightEntitiesState = Dictionary<Light>

const initialState = {}

const mapLights = R.indexBy<Light>(R.pipe(R.prop('id'), R.toString))

const updateLight = (state: LightEntitiesState, light: Light): LightEntitiesState => ({
    ...state,
    [light.id]: {
        ...state[light.id],
        ...light,
    },
})

const reducers: ActionReducers<LightEntitiesState> = [
    [LOAD_LIGHTS_SUCCESS, (_state, { payload }) => mapLights(payload as Light[])],
    [LIGHT_STATE_CHANGED, (state, { payload }) => ({
        ...state,
        ...updateLight(state, payload as Light),
    })],
]

export default createReducer(reducers, initialState)
