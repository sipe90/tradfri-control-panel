import { connect } from 'react-redux'

import { fetchLights, lightStateChanged, startLightPolling, stopLightPolling, updateLight } from 'actions/lights'

import Lights from 'components/lights/Lights'

const mapStateToProps = state => ({
    gateways: state.entities.gateways,
    lights: state.entities.lights,
    initialDataLoading: state.modules.lights.initialDataLoading
})

const mapDispatchToProps = dispatch => ({
    loadLights: () => dispatch(fetchLights()),
    lightStateChanged: (light) => dispatch(lightStateChanged(light)),
    startLightPolling: () => dispatch(startLightPolling()),
    stopLightPolling: () => dispatch(stopLightPolling()),
    updateLight: (gatewayId, light) => dispatch(updateLight(gatewayId, light))
})

const LightsModule = connect(
    mapStateToProps,
    mapDispatchToProps
)(Lights)

export default LightsModule
