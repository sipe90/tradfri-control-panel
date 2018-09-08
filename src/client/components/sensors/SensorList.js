import React, { Component } from 'react'
import { Spin, Icon, List } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import SensorItem from 'components/sensors/SensorItem'

import 'components/sensors/SensorList.css'

class Sensors extends Component {

    componentDidMount() {
        this.props.loadSensors()
        this.props.startSensorPolling()
    }

    componentWillUnmount() {
        this.props.stopSensorPolling()
    }

    render() {
        return (
            <Spin spinning={this.props.initialDataLoading} style={{ marginTop: '240px' }} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                <List itemLayout='vertical'
                    dataSource={R.values(this.props.sensors)}
                    renderItem={this.renderItem.bind(this)} />
            </Spin>
        )
    }

    renderItem(sensor) {
        return (
            <SensorItem key={sensor.id}
                sensor={sensor}
                sensorStateChanged={this.props.sensorStateChanged}
                updateSensor={this.props.updateSensor} />
        )
    }

}

Sensors.propTypes = {
    sensors: PropTypes.object.isRequired,
    loadSensors: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    sensorStateChanged: PropTypes.func.isRequired,
    updateSensor: PropTypes.func.isRequired,
    startSensorPolling: PropTypes.func.isRequired,
    stopSensorPolling: PropTypes.func.isRequired
}

export default Sensors
