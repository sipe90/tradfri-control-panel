
import * as R from 'ramda'

import schemas from '@/schemas'

import { LOAD_SENSORS_SUCCESS, SENSOR_STATE_CHANGED } from '@/actions/sensors'
import { Sensor, Dictionary } from 'shared/types'
import { Reducer } from 'redux'
import { NormalizeResult } from '@/types'
import { normalizer, createReducer } from '@/utils'

type SensorEntitiesState = Dictionary<Sensor>

const initialState = {}

const normalizeSensors = normalizer(schemas.sensors)

const mapSensors = R.pipe<Sensor[], NormalizeResult, Dictionary<Sensor> | undefined>(
    normalizeSensors,
    R.path(['entities', 'sensors'])
)

const updateSensor = (previousState: SensorEntitiesState, sensor: Sensor): SensorEntitiesState => ({
    ...previousState, 
    [sensor.id]: {
        ...previousState[sensor.id],
        ...sensor 
    }
})

const reducer = createReducer<SensorEntitiesState>([
    [LOAD_SENSORS_SUCCESS, (_state, { payload }) => ({  
        ...mapSensors(payload as Sensor[])
    })],
    [SENSOR_STATE_CHANGED, (state, { payload }) => ({
        ...state,
        ...updateSensor(state, payload as Sensor)
    })]
])

const sensorEntitiesReducer: Reducer<SensorEntitiesState> = (state = initialState, action) => reducer(state, action)

export default sensorEntitiesReducer
