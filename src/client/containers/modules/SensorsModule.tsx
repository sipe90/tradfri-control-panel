import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    fetchSensors, sensorStateChanged, updateSensor,
} from '@/actions/sensors'
import SensorList from '@/components/sensors/SensorList'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'
import { Dictionary, ISensor } from 'shared/types'

interface ISensorsModuleProps {
    sensors: Dictionary<ISensor>
    initialDataLoading: boolean
    loadSensors: () => void
    sensorStateChanged: (sensor: ISensor) => void
    updateSensor: (sensor: ISensor) => void
}

class SensorsModule extends Component<ISensorsModuleProps> {

    public componentDidMount() {
        this.props.loadSensors()
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

const mapStateToProps = (state: IAppState) => ({
    initialDataLoading: state.modules.sensors.initialDataLoading,
    sensors: state.entities.sensors,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    loadSensors: () => dispatch(fetchSensors()),
    sensorStateChanged: (sensor: ISensor) => dispatch(sensorStateChanged(sensor)),
    updateSensor: (sensor: ISensor) => dispatch(updateSensor(sensor)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SensorsModule)
