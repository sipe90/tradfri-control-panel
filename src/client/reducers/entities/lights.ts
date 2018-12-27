
import * as R from 'ramda'
import { Reducer } from 'redux'

import { LIGHT_STATE_CHANGED, LOAD_LIGHTS_SUCCESS } from '@/actions/lights'
import schemas from '@/schemas'
import { INormalizeResult } from '@/types'
import { createReducer, normalizer } from '@/utils'
import { Dictionary, Light } from 'shared/types'

type LightEntitiesState = Dictionary<Light>

const initialState = {}

const normalizeLights = normalizer(schemas.lights)

const mapLights = R.pipe<Light[], INormalizeResult, Dictionary<Light> | undefined>(
    normalizeLights,
    R.path(['entities', 'lights']),
)

const updateLight = (state: LightEntitiesState, light: Light): LightEntitiesState => ({
    ...state,
    [light.id]: {
        ...state[light.id],
        ...light,
    },
})

const reducer = createReducer<LightEntitiesState>([
    [LOAD_LIGHTS_SUCCESS, (_state, { payload }) => ({
        ...mapLights(payload as Light[]),
    })],
    [LIGHT_STATE_CHANGED, (state, { payload }) => ({
        ...state,
        ...updateLight(state, payload as Light),
    })],
])

const lightEntitiesReducer: Reducer<LightEntitiesState> = (state = initialState, action) => reducer(state, action)

export default lightEntitiesReducer
