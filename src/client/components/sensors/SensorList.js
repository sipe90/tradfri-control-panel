import React from 'react'
import { Spin, Icon, List } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import SensorItem from 'components/sensors/SensorItem'

import 'components/sensors/SensorList.css'

const SensorList = (props) => (
    <Spin spinning={props.initialDataLoading} style={{ marginTop: '240px' }} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
        <List itemLayout='vertical'
            dataSource={R.values(props.sensors)}
            renderItem={(item) => renderItem(item, props)} />
    </Spin>
)

const renderItem = (sensor, { sensorStateChanged, updateSensor }) =>
    (
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
