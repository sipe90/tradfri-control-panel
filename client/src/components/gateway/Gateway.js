import React, { Component } from 'react'
import { Spin, Icon } from 'antd'
import PropTypes from 'prop-types'

import GatewayCard from 'components/gateway/GatewayCard'
import AddGateway from 'components/gateway/add-gateway/AddGateway'

import 'components/gateway/Gateway.css'

class Gateway extends Component {

    componentDidMount() {
        this.props.loadGateway()
        this.props.startGatewayPolling()
    }

    componentWillUnmount() {
        this.props.stopGatewayPolling()
    }

    render() {
        return (
            <div>
                <Spin spinning={this.props.initialDataLoading} style={{ marginTop: '240px' }} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                    {this.props.gateway ?
                        <GatewayCard
                            gateway={this.props.gateway}
                            gatewayStateChanged={this.props.gatewayStateChanged}
                            updateGateway={this.props.updateGateway} />
                        :
                        <AddGateway />}
                </Spin>
            </div>
        )
    }
}

Gateway.propTypes = {
    gateway: PropTypes.object,
    loadGateway: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    gatewayStateChanged: PropTypes.func.isRequired,
    updateGateway: PropTypes.func.isRequired,
    startGatewayPolling: PropTypes.func.isRequired,
    stopGatewayPolling: PropTypes.func.isRequired
}

export default Gateway
