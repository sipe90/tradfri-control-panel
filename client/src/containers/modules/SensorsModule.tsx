import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchSensors, updateSensor } from '@/actions/sensors'
import SensorList from '@/components/sensors/SensorList'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'
import { Dictionary, Device } from '@tradfri-control-panel/shared'

const SensorsModule: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>()

    const sensors = useSelector<IAppState, Dictionary<Device>>((state) => state.entities.sensors)
    const initialDataLoading = useSelector<IAppState, boolean>((state) => state.modules.sensors.initialDataLoading)

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
