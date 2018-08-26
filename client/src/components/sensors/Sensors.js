import React, { Component } from 'react'
import { Spin, Icon } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import SensorCard from 'components/sensors/SensorCard'

import 'components/sensors/Sensors.css'

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
            <Spin spinning={this.props.initialDataLoading} style={{ marginTop: '240px' }} indicator={<Icon type='loading' style={{ fontSize: 24 }} spin />}>
                {!R.isEmpty(this.props.sensors) ?
                    R.values(this.props.sensors).map((sensor, idx) =>
                        <SensorCard
                            key={idx}
                            sensor={sensor}
                            sensorStateChanged={this.props.sensorStateChanged}
                            updateSensor={this.props.updateSensor} />
                    )
                    : !this.props.initialDataLoading ? 'No sensors found' : null
                }
            </Spin>
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
