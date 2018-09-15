import React from 'react'
import { List } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import Spinner from 'components/Spinner'
import SensorItem from 'components/sensors/SensorItem'

import 'components/sensors/SensorList.css'

const SensorList = (props) => (
    <Spinner spinning={props.initialDataLoading}>
        <List itemLayout='vertical'
            dataSource={R.values(props.sensors)}
            renderItem={(item) => renderItem(item, props)} />
    </Spinner>
)

const renderItem = (sensor, { sensorStateChanged, updateSensor }) => (
    <SensorItem key={sensor.id}
        sensor={sensor}
        sensorStateChanged={sensorStateChanged}
        updateSensor={updateSensor} />
)

SensorList.propTypes = {
    sensors: PropTypes.object.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    sensorStateChanged: PropTypes.func.isRequired,
    updateSensor: PropTypes.func.isRequired
}

export default SensorList
