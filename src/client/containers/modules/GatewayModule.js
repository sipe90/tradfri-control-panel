import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { fetchGateway, startGatewayPolling, stopGatewayPolling, gatewayStateChanged, saveGateway } from 'actions/gateway'

import Gateway from 'components/gateway/Gateway'

class GatewayModule extends Component {

    componentDidMount() {
        this.props.loadGateway()
        this.props.startGatewayPolling()
    }

    componentWillUnmount() {
        this.props.stopGatewayPolling()
    }

    render() {
        return (
            <Gateway
                gateway={this.props.gateway}
                initialDataLoading={this.props.initialDataLoading}
                gatewayStateChanged={this.props.gatewayStateChanged}
                saveGateway={this.props.saveGateway} />
        )
    }

}

GatewayModule.propTypes = {
    gateway: PropTypes.object,
    loadGateway: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    gatewayStateChanged: PropTypes.func.isRequired,
    saveGateway: PropTypes.func.isRequired,
    startGatewayPolling: PropTypes.func.isRequired,
    stopGatewayPolling: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    gateway: state.entities.gateway,
    initialDataLoading: state.modules.gateway.initialDataLoading
})

const mapDispatchToProps = dispatch => ({
    loadGateway: () => dispatch(fetchGateway()),
    gatewayStateChanged: (gateway) => dispatch(gatewayStateChanged(gateway)),
    startGatewayPolling: () => dispatch(startGatewayPolling()),
    stopGatewayPolling: () => dispatch(stopGatewayPolling()),
    saveGateway: (gatewayId, gateway) => dispatch(saveGateway(gatewayId, gateway))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GatewayModule)
