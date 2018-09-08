import { connect } from 'react-redux'

import { fetchLights, lightStateChanged, startLightPolling, stopLightPolling, updateLight } from 'actions/lights'

import LightList from 'components/lights/LightList'

const mapStateToProps = state => ({
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
)(LightList)

export default LightsModule
