import { connect } from 'react-redux'

import { fetchLights, updateLight } from 'actions/lights'

import Lights from 'components/lights/Lights'

const mapStateToProps = state => ({
    ...state.lights
})

const mapDispatchToProps = dispatch => ({
    loadLights: () => dispatch(fetchLights()),
    updateLight: (gatewayId, light) => dispatch(updateLight(gatewayId, light))
})

const LightsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Lights)

export default LightsContainer
