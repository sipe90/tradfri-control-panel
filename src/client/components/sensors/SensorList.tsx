import { List } from 'antd'
import * as R from 'ramda'
import React from 'react'

import SensorItem from '@/components/sensors/SensorItem'
import Spinner from '@/components/Spinner'
import { Dictionary, ISensor } from 'shared/types'

import './SensorList.css'

interface ISensorListProps {
    sensors: Dictionary<ISensor>
    initialDataLoading: boolean
    sensorStateChanged: (sensor: ISensor) => void
    updateSensor: (sensor: ISensor) => void
}

const SensorList: React.FunctionComponent<ISensorListProps> = (props) => (
    <Spinner spinning={props.initialDataLoading}>
        <List
            itemLayout='vertical'
            dataSource={R.values(props.sensors)}
            renderItem={(item: ISensor) => renderItem(item, props)}
        />
    </Spinner>
)

const renderItem = (sensor: ISensor, { sensorStateChanged, updateSensor }: ISensorListProps) => (
    <SensorItem
        key={sensor.id}
        sensor={sensor}
        sensorStateChanged={sensorStateChanged}
        updateSensor={updateSensor}
    />
)

export default SensorList
