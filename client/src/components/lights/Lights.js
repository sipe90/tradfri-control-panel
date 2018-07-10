import React, { Component } from 'react'
import { Spin, Icon } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import GatewayCard from 'components/lights/GatewayCard'
import LightCard from 'components/lights/LightCard'

import 'components/lights/Lights.css'

class Lights extends Component {

    componentDidMount() {
        this.props.loadLights()
    }
    
    render() {
        return (
            <Spin spinning={this.props.dataLoading} style={{ marginTop: '240px'}} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                <div className="card-container">
                    { !R.isEmpty(this.props.gateways) ? R.values(this.props.gateways).map((gateway, idx) => 
                        <GatewayCard
                            key={idx}
                            gateway={gateway}
                        >
                            {R.values(this.getLightsForGateway(gateway)).map((light, idx) =>
                                <LightCard 
                                    key={idx}
                                    light={light}
                                    nameEdit={this.props.nameEdit[light.id] || ''}
                                    lightStateChanged={this.props.lightStateChanged}
                                    nameEditChanged={this.props.nameEditChanged}
                                    updateLight={this.props.updateLight}/>
                            )}
                        </GatewayCard>)
                        : !this.props.dataLoading ? 'No lights found' : null
                    }
                </div>
            </Spin>
        )
    }

    getLightsForGateway({ id }) {
        return R.pickAll(this.props.gateways[id].lights, this.props.lights)
    }

}

Lights.propTypes = {
    gateways: PropTypes.object.isRequired,
    lights: PropTypes.object.isRequired,
    nameEdit: PropTypes.object.isRequired,
    loadLights: PropTypes.func.isRequired,
    dataLoading: PropTypes.bool.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    nameEditChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired
}

export default Lights
