import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LightGroupCard from 'components/lights/LightGroupCard'

import 'components/lights/Lights.css'

class Lights extends Component {

    componentDidMount() {
        this.props.loadLights()
    }
    
    render() {
        return (
            <div className="card-container">
                { this.props.lightsByGateway.length ? this.props.lightsByGateway.map((gateway, idx) =>
                    <LightGroupCard key={idx} gateway={gateway} />)
                    : 'No lights found' 
                }
            </div>
        )
    }

}

Lights.propTypes = {
    lightsByGateway: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired
    })).isRequired,
    loadLights: PropTypes.func.isRequired
}

export default Lights
