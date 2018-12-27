import { List } from 'antd'
import * as R from 'ramda'
import React from 'react'

import SensorItem from '@/components/sensors/SensorItem'
import Spinner from '@/components/Spinner'
import { Dictionary, Sensor } from 'shared/types'

import './SensorList.css'

interface ISensorListProps {
    sensors: Dictionary<Sensor>
    initialDataLoading: boolean
    sensorStateChanged: (sensor: Sensor) => void
    updateSensor: (sensor: Sensor) => void
}

const SensorList: React.FunctionComponent<ISensorListProps> = (props) => (
    <Spinner spinning={props.initialDataLoading}>
        <List
            itemLayout='vertical'
            dataSource={R.values(props.sensors)}
            renderItem={(item: Sensor) => renderItem(item, props)}
        />
    </Spinner>
)

const renderItem = (sensor: Sensor, { sensorStateChanged, updateSensor }: ISensorListProps) => (
    <SensorItem
        key={sensor.id}
        sensor={sensor}
        sensorStateChanged={sensorStateChanged}
        updateSensor={updateSensor}
    />
)

export default SensorList
