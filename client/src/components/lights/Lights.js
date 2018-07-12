import React, { Component } from 'react'
import { Card, Spin, Icon } from 'antd'
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
            <Spin spinning={this.props.initialDataLoading} style={{ marginTop: '240px'}} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                <div className="card-container">
                    { !R.isEmpty(this.props.gateways) ? R.values(this.props.gateways).map((gateway, idx) =>
                        this.gatewayHasLights(gateway) ?
                        <div className='gateway-card' key={idx}>
                            <Card title={gateway.name}>
                                {this.getLightsForGateway(gateway).map((light, idx) =>
                                    <LightCard 
                                        key={idx}
                                        light={light}
                                        nameEdit={this.props.nameEdit[light.id] || ''}
                                        lightStateChanged={this.props.lightStateChanged}
                                        nameEditChanged={this.props.nameEditChanged}
                                        updateLight={this.props.updateLight}/>
                                )}
                            </Card>
                        </div> : null)
                        : !this.props.initialDataLoading ? 'No lights found' : null
                    }
                </div>
            </Spin>
        )
    }

    gatewayHasLights({ id }) {
        return !R.isEmpty(this.props.gateways[id].lights)
    }

    getLightsForGateway({ id }) {
        return R.pipe(
            R.pickAll(this.props.gateways[id].lights),
            R.values,
            R.filter(Boolean)
        )(this.props.lights)
    }

}

Lights.propTypes = {
    gateways: PropTypes.object.isRequired,
    lights: PropTypes.object.isRequired,
    nameEdit: PropTypes.object.isRequired,
    loadLights: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.initialDataLoading,
    lightStateChanged: PropTypes.func.isRequired,
    nameEditChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired,
    startLightPolling: PropTypes.func.isRequired,
    stopLightPolling: PropTypes.func.isRequired
}

export default Lights
