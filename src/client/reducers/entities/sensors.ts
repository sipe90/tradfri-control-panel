import * as R from 'ramda'

import { LOAD_SENSORS_SUCCESS, SENSOR_STATE_CHANGED } from '@/actions/sensors'
import schemas from '@/schemas'
import { INormalizeResult } from '@/types'
import { ActionReducers, createReducer, normalizer } from '@/utils'
import { Dictionary, ISensor } from 'shared/types'

export type SensorEntitiesState = Dictionary<ISensor>

const initialState = {}

const normalizeSensors = normalizer(schemas.sensors)

const mapSensors = R.pipe<ISensor[], INormalizeResult, Dictionary<ISensor> | undefined>(
    normalizeSensors,
    R.path(['entities', 'sensors']),
)

const updateSensor = (previousState: SensorEntitiesState, sensor: ISensor): SensorEntitiesState => ({
    ...previousState,
    [sensor.id]: {
        ...previousState[sensor.id],
        ...sensor,
    },
})

const reducers: ActionReducers<SensorEntitiesState> = [
    [LOAD_SENSORS_SUCCESS, (_state, { payload }) => ({
        ...mapSensors(payload as ISensor[]),
    })],
    [SENSOR_STATE_CHANGED, (state, { payload }) => ({
        ...state,
        ...updateSensor(state, payload as ISensor),
    })],
]

export default createReducer(reducers, initialState)
