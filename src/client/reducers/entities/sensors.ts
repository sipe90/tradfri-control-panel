import * as R from 'ramda'

import { LOAD_SENSORS_SUCCESS, SENSOR_STATE_CHANGED } from '@/actions/sensors'
import { ActionReducers, createReducer } from '@/utils'
import { Dictionary, ISensor } from 'shared/types'

export type SensorEntitiesState = Dictionary<ISensor>

const initialState = {}

const mapSensors = R.indexBy<ISensor>(R.pipe(R.prop('id'), R.toString))

const updateSensor = (previousState: SensorEntitiesState, sensor: ISensor): SensorEntitiesState => ({
    ...previousState,
    [sensor.id]: {
        ...previousState[sensor.id],
        ...sensor,
    },
})

const reducers: ActionReducers<SensorEntitiesState> = [
    [LOAD_SENSORS_SUCCESS, (_state, { payload }) => mapSensors(payload)],
    [SENSOR_STATE_CHANGED, (state, { payload }) => ({
        ...state,
        ...updateSensor(state, payload as ISensor),
    })],
]

export default createReducer(reducers, initialState)
