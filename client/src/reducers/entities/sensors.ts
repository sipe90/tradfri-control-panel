import * as R from 'ramda'

import { LOAD_SENSORS_SUCCESS, SENSOR_STATE_CHANGED } from '#/actions/sensors'
import { ActionReducers, createReducer } from '#/utils'
import { Dictionary, Sensor } from '@tradfri-control-panel/shared'

export type SensorEntitiesState = Dictionary<Sensor>

const initialState = {}

const mapSensors = R.indexBy<Sensor>(R.pipe(R.prop('id'), R.toString))

const updateSensor = (previousState: SensorEntitiesState, sensor: Sensor): SensorEntitiesState => ({
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
        ...updateSensor(state, payload as Sensor),
    })],
]

export default createReducer(reducers, initialState)
