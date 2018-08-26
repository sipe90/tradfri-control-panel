import React, { Component } from 'react'
import { Spin, Icon } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import LightCard from 'components/lights/LightCard'

import 'components/lights/Lights.css'

class Lights extends Component {

    componentDidMount() {
        this.props.loadLights()
        this.props.startLightPolling()
    }

    componentWillUnmount() {
        this.props.stopLightPolling()
    }

    render() {
        return (
            <Spin spinning={this.props.initialDataLoading} style={{ marginTop: '240px' }} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                {!R.isEmpty(this.props.lights) ?
                    R.values(this.props.lights).map((light, idx) =>
                        <LightCard
                            key={idx}
                            light={light}
                            lightStateChanged={this.props.lightStateChanged}
                            updateLight={this.props.updateLight} />
                    )
                    : !this.props.initialDataLoading ? 'No lights found' : null}

            </Spin>
        )
    }
}

Lights.propTypes = {
    lights: PropTypes.object.isRequired,
    loadLights: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired,
    startLightPolling: PropTypes.func.isRequired,
    stopLightPolling: PropTypes.func.isRequired
}

export default Lights
