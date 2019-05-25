import * as R from 'ramda'

import { LIGHT_STATE_CHANGED, LOAD_LIGHTS_SUCCESS } from '@/actions/lights'
import { ActionReducers, createReducer } from '@/utils'
import { Dictionary, ILight } from 'shared/types'

export type LightEntitiesState = Dictionary<ILight>

const initialState = {}

const mapLights = R.indexBy<ILight>(R.pipe(R.prop('id'), R.toString))

const updateLight = (state: LightEntitiesState, light: ILight): LightEntitiesState => ({
    ...state,
    [light.id]: {
        ...state[light.id],
        ...light,
    },
})

const reducers: ActionReducers<LightEntitiesState> = [
    [LOAD_LIGHTS_SUCCESS, (_state, { payload }) => mapLights(payload as ILight[])],
    [LIGHT_STATE_CHANGED, (state, { payload }) => ({
        ...state,
        ...updateLight(state, payload as ILight),
    })],
]

export default createReducer(reducers, initialState)
