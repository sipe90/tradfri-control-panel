import { connect } from 'react-redux'

import { fetchSensors, updateSensor, startSensorPolling, stopSensorPolling, sensorStateChanged } from 'actions/sensors'

import Sensors from 'components/sensors/Sensors'

const mapStateToProps = state => ({
    gateways: state.entities.gateways,
    sensors: state.entities.sensors,
    initialDataLoading: state.modules.sensors.initialDataLoading
})

const mapDispatchToProps = dispatch => ({
    loadSensors: () => dispatch(fetchSensors()),
    sensorStateChanged: (sensor) => dispatch(sensorStateChanged(sensor)),
    updateSensor: (gatewayId, sensor) => dispatch(updateSensor(gatewayId, sensor)),
    startSensorPolling: () => dispatch(startSensorPolling()),
    stopSensorPolling: () => dispatch(stopSensorPolling())
})

const SensorsModule = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sensors)

export default SensorsModule
