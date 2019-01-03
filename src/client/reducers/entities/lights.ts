
import * as R from 'ramda'
import { Reducer } from 'redux'

import { LIGHT_STATE_CHANGED, LOAD_LIGHTS_SUCCESS } from '@/actions/lights'
import schemas from '@/schemas'
import { INormalizeResult } from '@/types'
import { createReducer, normalizer } from '@/utils'
import { Dictionary, ILight } from 'shared/types'

export type LightEntitiesState = Dictionary<ILight>

const initialState = {}

const normalizeLights = normalizer(schemas.lights)

const mapLights = R.pipe<ILight[], INormalizeResult, Dictionary<ILight> | undefined>(
    normalizeLights,
    R.path(['entities', 'lights']),
)

const updateLight = (state: LightEntitiesState, light: ILight): LightEntitiesState => ({
    ...state,
    [light.id]: {
        ...state[light.id],
        ...light,
    },
})

const reducer = createReducer<LightEntitiesState>([
    [LOAD_LIGHTS_SUCCESS, (_state, { payload }) => ({
        ...mapLights(payload as ILight[]),
    })],
    [LIGHT_STATE_CHANGED, (state, { payload }) => ({
        ...state,
        ...updateLight(state, payload as ILight),
    })],
])

const lightEntitiesReducer: Reducer<LightEntitiesState> = (state = initialState, action) => reducer(state, action)

export default lightEntitiesReducer
