import { Dictionary } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import {
    fetchSensors, sensorStateChanged, startSensorPolling,
    stopSensorPolling, updateSensor,
} from '@/actions/sensors'
import SensorList from '@/components/sensors/SensorList'
import { ISensor } from 'shared/types'

interface ISensorsModuleProps {
    sensors: Dictionary<ISensor>
    initialDataLoading: boolean
    loadSensors: () => void
    sensorStateChanged: (sensor: ISensor) => void
    updateSensor: (sensor: ISensor) => void
    startSensorPolling: () => void
    stopSensorPolling: () => void
}

class SensorsModule extends Component<ISensorsModuleProps> {

    public componentDidMount() {
        this.props.loadSensors()
        this.props.startSensorPolling()
    }

    public componentWillUnmount() {
        this.props.stopSensorPolling()
    }

    public render() {
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
    initialDataLoading: state.modules.sensors.initialDataLoading,
    sensors: state.entities.sensors,
})

// TODO: State type
const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    loadSensors: () => dispatch(fetchSensors()),
    sensorStateChanged: (sensor: ISensor) => dispatch(sensorStateChanged(sensor)),
    startSensorPolling: () => dispatch(startSensorPolling()),
    stopSensorPolling: () => dispatch(stopSensorPolling()),
    updateSensor: (sensor: ISensor) => dispatch(updateSensor(sensor)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SensorsModule)
