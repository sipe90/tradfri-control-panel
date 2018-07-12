import { connect } from 'react-redux'

import { fetchSensors, nameEditChanged, updateSensor, startSensorPolling, stopSensorPolling } from 'actions/sensors'

import Sensors from 'components/sensors/Sensors'

const mapStateToProps = state => ({
    gateways: state.entities.gateways,
    sensors: state.entities.sensors,
    nameEdit: state.modules.sensors.nameEdit,
    dataLoading: state.modules.sensors.dataLoading
})

const mapDispatchToProps = dispatch => ({
    loadSensors: () => dispatch(fetchSensors()),
    nameEditChanged: (sensorId, name) => dispatch(nameEditChanged(sensorId, name)),
    updateSensor: (gatewayId, sensor) => dispatch(updateSensor(gatewayId, sensor)),
    startSensorPolling: () => dispatch(startSensorPolling()),
    stopSensorPolling: () => dispatch(stopSensorPolling())
})

const SensorsModule = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sensors)

export default SensorsModule
