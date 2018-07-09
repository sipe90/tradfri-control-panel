import { connect } from 'react-redux'

import { fetchLights, lightStateChanged, updateLight } from 'actions/lights'

import Lights from 'components/lights/Lights'

const mapStateToProps = state => ({
    gateways: state.entities.gateways,
    lights: state.entities.lights,
    dataLoading: state.modules.lights.dataLoading
})

const mapDispatchToProps = dispatch => ({
    loadLights: () => dispatch(fetchLights()),
    lightStateChanged: (light) => dispatch(lightStateChanged(light)),
    updateLight: (gatewayId, light) => dispatch(updateLight(gatewayId, light))
})

const LightsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Lights)

export default LightsContainer
