import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchGateway, startGatewayPolling, stopGatewayPolling, gatewayStateChanged, saveGateway } from '@/actions/gateway'

import { Gateway } from 'shared/types'
import GatewayComponent from '@/components/gateway/Gateway'
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface GatewayModuleProps {
    gateway: Gateway
    initialDataLoading: boolean
    loadGateway: () => void
    gatewayStateChanged:(gateway: Gateway) => void
    saveGateway: (gateway: Gateway) => void
    startGatewayPolling:  () => void
    stopGatewayPolling:  () => void
}

class GatewayModule extends Component<GatewayModuleProps> {

    componentDidMount() {
        this.props.loadGateway()
        this.props.startGatewayPolling()
    }

    componentWillUnmount() {
        this.props.stopGatewayPolling()
    }

    render() {
        return (
            <GatewayComponent
                gateway={this.props.gateway}
                initialDataLoading={this.props.initialDataLoading}
                gatewayStateChanged={this.props.gatewayStateChanged}
                saveGateway={this.props.saveGateway} />
        )
    }

}

const mapStateToProps = (state: any) => ({
    gateway: state.entities.gateway,
    initialDataLoading: state.modules.gateway.initialDataLoading
})

// TODO: State type
const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    loadGateway: () => dispatch(fetchGateway()),
    gatewayStateChanged: (gateway: Gateway) => dispatch(gatewayStateChanged(gateway)),
    startGatewayPolling: () => dispatch(startGatewayPolling()),
    stopGatewayPolling: () => dispatch(stopGatewayPolling()),
    saveGateway: (gateway: Gateway) => dispatch(saveGateway(gateway))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GatewayModule)
