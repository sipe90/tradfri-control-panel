import { List } from 'antd'
import * as R from 'ramda'
import React from 'react'

import SensorItem from '#/components/sensors/SensorItem'
import Spinner from '#/components/Spinner'
import { Dictionary, Sensor } from 'shared'

import './SensorList.css'

interface SensorListProps {
    sensors: Dictionary<Sensor>
    initialDataLoading: boolean
    updateSensor: (sensor: Sensor) => void
}

const SensorList: React.FC<SensorListProps> = (props) => (
    <Spinner spinning={props.initialDataLoading}>
        <List
            itemLayout='vertical'
            dataSource={R.values(props.sensors)}
            renderItem={(sensor) =>
                <SensorItem
                    key={sensor.id}
                    sensor={sensor}
                    updateSensor={props.updateSensor}
                />}
        />
    </Spinner>
)

export default SensorList
