import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    deleteGateway, fetchGateway, rebootGateway,
     saveGateway, startGatewayPolling,  stopGatewayPolling,
     updateGateway
} from '@/actions/gateway'
import GatewayComponent from '@/components/gateway/Gateway'
import GatewayWizard from '@/components/gateway/GatewayWizard'
import Spinner from '@/components/Spinner'
import { GATEWAY_EDIT_FORM } from '@/containers/gateway/GatewayEditFormContainer'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'
import { submit } from 'redux-form'
import { IGateway } from 'shared/types'

interface IGatewayModuleProps {
    gateway: IGateway | null
    initialDataLoading: boolean
    dispatchLoadGateway: () => void
    dispatchSaveGateway: (gateway: IGateway) => void
    dispatchUpdateGateway: (gateway: Partial<IGateway>) => void
    dispatchDeleteGateway: () => void
    dispatchRebootGateway: () => void
    dispatchStartGatewayPolling: () => void
    dispatchStopGatewayPolling: () => void
    dispatchSubmitEditGatewayForm: () => void
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
                {!initialDataLoading && (!gateway ? <GatewayWizard /> : this.renderGateway(gateway))}
            </Spinner>
        )
    }

    private renderGateway = (gateway: IGateway) => {
        const {
            initialDataLoading, dispatchDeleteGateway, dispatchSaveGateway,
            dispatchUpdateGateway, dispatchSubmitEditGatewayForm, dispatchRebootGateway
        } = this.props
        return (
            <GatewayComponent
                {...{
                        gateway, initialDataLoading, dispatchSaveGateway,
                        dispatchUpdateGateway, dispatchSubmitEditGatewayForm, dispatchDeleteGateway,
                        dispatchRebootGateway
                    }
                }
            />
        )
    }

}

const mapStateToProps = (state: IAppState) => ({
    gateway: state.entities.gateway,
    initialDataLoading: state.modules.gateway.initialDataLoading,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    dispatchLoadGateway: () => dispatch(fetchGateway()),
    dispatchSaveGateway: (gateway: IGateway) => dispatch(saveGateway(gateway)),
    dispatchUpdateGateway: (gateway: Partial<IGateway>) => dispatch(updateGateway(gateway)),
    dispatchDeleteGateway: () => dispatch(deleteGateway()),
    dispatchRebootGateway: () => dispatch(rebootGateway()),
    dispatchStartGatewayPolling: () => dispatch(startGatewayPolling()),
    dispatchStopGatewayPolling: () => dispatch(stopGatewayPolling()),
    dispatchSubmitEditGatewayForm: () => dispatch(submit(GATEWAY_EDIT_FORM))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(GatewayModule)
