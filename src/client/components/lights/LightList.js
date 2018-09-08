import React, { Component } from 'react'
import { Spin, Icon, List } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import LightItem from 'components/lights/LightItem'

import 'components/lights/LightList.css'

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
                <List itemLayout='vertical'
                    dataSource={R.values(this.props.lights)}
                    renderItem={this.renderItem.bind(this)} />
            </Spin>
        )
    }

    renderItem(light) {
        return (
            <LightItem key={light.id}
                light={light}
                lightStateChanged={this.props.lightStateChanged}
                updateLight={this.props.updateLight} />
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
