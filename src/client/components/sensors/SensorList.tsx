import React from 'react'
import { List } from 'antd'
import R, { Dictionary } from 'ramda'

import Spinner from 'components/Spinner'
import SensorItem from 'components/sensors/SensorItem'

import 'components/sensors/SensorList.css'
import { Sensor } from 'shared/types';

interface SensorListProps {
    sensors: Dictionary<Sensor>
    initialDataLoading: boolean
    sensorStateChanged: (sensor: Sensor) => void
    updateSensor: (sensor: Sensor) => void
}

const SensorList: React.FunctionComponent<SensorListProps> = (props) => (
    <Spinner spinning={props.initialDataLoading}>
        <List itemLayout='vertical'
            dataSource={R.values(props.sensors)}
            renderItem={(item: Sensor) => renderItem(item, props)} />
    </Spinner>
)

const renderItem = (sensor: Sensor, { sensorStateChanged, updateSensor }: SensorListProps) => (
    <SensorItem key={sensor.id}
        sensor={sensor}
        sensorStateChanged={sensorStateChanged}
        updateSensor={updateSensor} />
)

export default SensorList
