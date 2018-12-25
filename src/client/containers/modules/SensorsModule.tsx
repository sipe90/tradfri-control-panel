import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchSensors, updateSensor, startSensorPolling, stopSensorPolling, sensorStateChanged } from '@/actions/sensors'

import SensorList from '@/components/sensors/SensorList'
import { Dictionary } from 'ramda';
import { Sensor } from 'shared/types';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface SensorsModuleProps {
    sensors: Dictionary<Sensor>
    initialDataLoading: boolean
    loadSensors: () => void
    sensorStateChanged: (sensor: Sensor) => void
    updateSensor: (sensor: Sensor) => void
    startSensorPolling: () => void
    stopSensorPolling: () => void
}


class SensorsModule extends Component<SensorsModuleProps> {

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

// TODO: State type
const mapStateToProps = (state: any) => ({
    sensors: state.entities.sensors,
    initialDataLoading: state.modules.sensors.initialDataLoading
})

// TODO: State type
const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    loadSensors: () => dispatch(fetchSensors()),
    sensorStateChanged: (sensor: Sensor) => dispatch(sensorStateChanged(sensor)),
    updateSensor: (sensor: Sensor) => dispatch(updateSensor(sensor)),
    startSensorPolling: () => dispatch(startSensorPolling()),
    stopSensorPolling: () => dispatch(stopSensorPolling())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SensorsModule)
