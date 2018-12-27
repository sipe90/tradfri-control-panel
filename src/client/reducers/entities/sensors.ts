
import * as R from 'ramda'
import { Reducer } from 'redux'

import { LOAD_SENSORS_SUCCESS, SENSOR_STATE_CHANGED } from '@/actions/sensors'
import schemas from '@/schemas'
import { INormalizeResult } from '@/types'
import { createReducer, normalizer } from '@/utils'
import { Dictionary, Sensor } from 'shared/types'

type SensorEntitiesState = Dictionary<Sensor>

const initialState = {}

const normalizeSensors = normalizer(schemas.sensors)

const mapSensors = R.pipe<Sensor[], INormalizeResult, Dictionary<Sensor> | undefined>(
    normalizeSensors,
    R.path(['entities', 'sensors']),
)

const updateSensor = (previousState: SensorEntitiesState, sensor: Sensor): SensorEntitiesState => ({
    ...previousState,
    [sensor.id]: {
        ...previousState[sensor.id],
        ...sensor,
    },
})

const reducer = createReducer<SensorEntitiesState>([
    [LOAD_SENSORS_SUCCESS, (_state, { payload }) => ({
        ...mapSensors(payload as Sensor[]),
    })],
    [SENSOR_STATE_CHANGED, (state, { payload }) => ({
        ...state,
        ...updateSensor(state, payload as Sensor),
    })],
])

const sensorEntitiesReducer: Reducer<SensorEntitiesState> = (state = initialState, action) => reducer(state, action)

export default sensorEntitiesReducer
