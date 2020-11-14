import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchSensors, updateSensor } from '#/actions/sensors'
import SensorList from '#/components/sensors/SensorList'
import { AppState } from '#/reducers'
import { AppDispatch } from '#/types'
import { Dictionary, Device } from 'shared'

const SensorsModule: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>()

    const sensors = useSelector<AppState, Dictionary<Device>>((state) => state.entities.sensors)
    const initialDataLoading = useSelector<AppState, boolean>((state) => state.modules.sensors.initialDataLoading)

    useEffect(() => {
        dispatch(fetchSensors())
    }, [])

    return (
        <SensorList
            sensors={sensors}
            initialDataLoading={initialDataLoading}
            updateSensor={(sensor) => dispatch(updateSensor(sensor))}
        />
    )
}

export default SensorsModule
