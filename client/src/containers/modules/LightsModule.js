import { connect } from 'react-redux'

import { fetchLights, lightStateChanged, startLightPolling, stopLightPolling, nameEditChanged, updateLight } from 'actions/lights'

import Lights from 'components/lights/Lights'

const mapStateToProps = state => ({
    gateways: state.entities.gateways,
    lights: state.entities.lights,
    nameEdit: state.modules.lights.nameEdit,
    dataLoading: state.modules.lights.dataLoading
})

const mapDispatchToProps = dispatch => ({
    loadLights: () => dispatch(fetchLights()),
    lightStateChanged: (light) => dispatch(lightStateChanged(light)),
    startLightPolling: () => dispatch(startLightPolling()),
    stopLightPolling: () => dispatch(stopLightPolling()),
    nameEditChanged: (lightId, name) => dispatch(nameEditChanged(lightId, name)),
    updateLight: (gatewayId, light) => dispatch(updateLight(gatewayId, light))
})

const LightsModule = connect(
    mapStateToProps,
    mapDispatchToProps
)(Lights)

export default LightsModule
