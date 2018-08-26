import React, { Component } from 'react'
import { Spin, Icon } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import GatewayCard from 'components/gateways/GatewayCard'

import 'components/gateways/Gateways.css'

class Gateways extends Component {

    componentDidMount() {
        this.props.loadGateways()
        this.props.startGatewayPolling()
    }

    componentWillUnmount() {
        this.props.stopGatewayPolling()
    }
    
    render() {
        return (
            <Spin spinning={this.props.initialDataLoading} style={{ marginTop: '240px'}} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                <div className='card-container'>
                    { !R.isEmpty(this.props.gateways) ? R.values(this.props.gateways).map((gateway, idx) =>
                        <GatewayCard 
                            key={idx}
                            gateway={gateway}
                            gatewayStateChanged={this.props.gatewayStateChanged}
                            updateGateway={this.props.updateGateway}/>
                    )
                        : !this.props.initialDataLoading ? 'No gateways found' : null }
                </div>
            </Spin>
        )
    }

}

Gateways.propTypes = {
    gateways: PropTypes.object.isRequired,
    loadGateways: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    gatewayStateChanged: PropTypes.func.isRequired,
    updateGateway: PropTypes.func.isRequired,
    startGatewayPolling: PropTypes.func.isRequired,
    stopGatewayPolling: PropTypes.func.isRequired
}

export default Gateways
