import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { fetchLights, lightStateChanged, startLightPolling, stopLightPolling, updateLight } from 'actions/lights'

import LightList from 'components/lights/LightList'

class LightsModule extends Component {

    componentDidMount() {
        this.props.loadLights()
        this.props.startLightPolling()
    }

    componentWillUnmount() {
        this.props.stopLightPolling()
    }

    render() {
        return (
            <LightList
                lights={this.props.lights}
                initialDataLoading={this.props.initialDataLoading}
                lightStateChanged={this.props.lightStateChanged}
                updateLight={this.props.updateLight}
            />
        )
    }
}

LightsModule.propTypes = {
    lights: PropTypes.object.isRequired,
    loadLights: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired,
    startLightPolling: PropTypes.func.isRequired,
    stopLightPolling: PropTypes.func.isRequired
}

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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LightsModule)