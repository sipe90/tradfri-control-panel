import { connect } from 'react-redux'

import { fetchLights } from 'actions/lights'

import Lights from 'components/lights/Lights'

const mapStateToProps = state => ({
    ...state.lights
})

const mapDispatchToProps = dispatch => ({
    loadLights: () => dispatch(fetchLights())
})

const LightsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Lights)

export default LightsContainer
