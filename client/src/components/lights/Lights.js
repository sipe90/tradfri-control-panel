import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import LightGroupCard from 'components/lights/LightGroupCard'

import 'components/lights/Lights.css'

class Lights extends Component {

    componentDidMount() {
        this.props.loadLights()
    }
    
    render() {
        return (
            <div className="card-container">
                { !R.isEmpty(this.props.gatewaysById) ? R.values(this.props.gatewaysById).map((gateway, idx) => 
                    <LightGroupCard
                        key={idx}
                        gateway={gateway}
                        lights={this.getLightsForGateway(gateway)}
                        lightStateChanged={this.props.lightStateChanged}
                        updateLight={this.props.updateLight}
                    />)
                    : 'No lights found' 
                }
            </div>
        )
    }

    getLightsForGateway({ id }) {
        return R.pickAll(this.props.gatewayLights[id], this.props.lightsById)
    }

}

Lights.propTypes = {
    gatewaysById: PropTypes.object.isRequired,
    lightsById: PropTypes.object.isRequired,
    gatewayLights: PropTypes.object.isRequired,
    loadLights: PropTypes.func.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired
}

export default Lights
