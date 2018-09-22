import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { fetchSensors, updateSensor, startSensorPolling, stopSensorPolling, sensorStateChanged } from 'actions/sensors'

import SensorList from 'components/sensors/SensorList'

class SensorsModule extends Component {

    componentDidMount() {
        this.props.loadSensors()
        this.props.startSensorPolling()
    }

    componentWillUnmount() {
        this.props.stopSensorPolling()
    }

    render() {
        return (
            <SensorList
                sensors={this.props.sensors}
                initialDataLoading={this.props.initialDataLoading}
                sensorStateChanged={this.props.sensorStateChanged}
                updateSensor={this.props.updateSensor}
            />
        )
    }
}

SensorsModule.propTypes = {
    sensors: PropTypes.object.isRequired,
    loadSensors: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    sensorStateChanged: PropTypes.func.isRequired,
    updateSensor: PropTypes.func.isRequired,
    startSensorPolling: PropTypes.func.isRequired,
    stopSensorPolling: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    sensors: state.entities.sensors,
    initialDataLoading: state.modules.sensors.initialDataLoading
})

const mapDispatchToProps = dispatch => ({
    loadSensors: () => dispatch(fetchSensors()),
    sensorStateChanged: (sensor) => dispatch(sensorStateChanged(sensor)),
    updateSensor: (sensor) => dispatch(updateSensor(sensor)),
    startSensorPolling: () => dispatch(startSensorPolling()),
    stopSensorPolling: () => dispatch(stopSensorPolling())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SensorsModule)
