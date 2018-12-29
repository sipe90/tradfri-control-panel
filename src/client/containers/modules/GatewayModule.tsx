import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import {
    fetchGateway, gatewayStateChanged, saveGateway,
    startGatewayPolling, stopGatewayPolling,
} from '@/actions/gateway'
import GatewayComponent from '@/components/gateway/Gateway'
import GatewayWizard from '@/components/gateway/GatewayWizard'
import Spinner from '@/components/Spinner'
import { IGateway } from 'shared/types'

interface IGatewayModuleProps {
    gateway: IGateway
    initialDataLoading: boolean
    dispatchLoadGateway: () => void
    dispatchGatewayStateChanged: (gateway: IGateway) => void
    dispatchSaveGateway: (gateway: IGateway) => void
    dispatchStartGatewayPolling: () => void
    dispatchStopGatewayPolling: () => void
}

class GatewayModule extends Component<IGatewayModuleProps> {

    public componentDidMount() {
        this.props.dispatchLoadGateway()
        this.props.dispatchStartGatewayPolling()
    }

    public componentWillUnmount() {
        this.props.dispatchStopGatewayPolling()
    }

    public render = () => {
        const { gateway, initialDataLoading } = this.props
        return (
            <Spinner spinning={initialDataLoading}>
                {!initialDataLoading && (!gateway ? <GatewayWizard /> : this.renderGateway())}
            </Spinner>
        )
    }

    private renderGateway = () => {
        const { gateway, initialDataLoading, dispatchGatewayStateChanged, dispatchSaveGateway } = this.props
        return (
            <GatewayComponent {...{ gateway, initialDataLoading, dispatchGatewayStateChanged, dispatchSaveGateway }}/>
        )
    }

}

const mapStateToProps = (state: any) => ({
    gateway: state.entities.gateway,
    initialDataLoading: state.modules.gateway.initialDataLoading,
})

// TODO: State type
const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    dispatchGatewayStateChanged: (gateway: IGateway) => dispatch(gatewayStateChanged(gateway)),
    dispatchLoadGateway: () => dispatch(fetchGateway()),
    dispatchSaveGateway: (gateway: IGateway) => dispatch(saveGateway(gateway)),
    dispatchStartGatewayPolling: () => dispatch(startGatewayPolling()),
    dispatchStopGatewayPolling: () => dispatch(stopGatewayPolling()),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(GatewayModule)
