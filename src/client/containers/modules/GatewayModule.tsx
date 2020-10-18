import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    deleteGateway, fetchGateway, rebootGateway,
    resetGateway, saveGateway, updateGateway
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
    loadGateway: () => void
    saveGateway: (gateway: IGateway) => void
    updateGateway: (gateway: Partial<IGateway>) => void
    deleteGateway: () => void
    rebootGateway: () => void
    resetGateway: () => void
    submitEditGatewayForm: () => void
}

class GatewayModule extends Component<IGatewayModuleProps> {

    public componentDidMount() {
        this.props.loadGateway()
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
            initialDataLoading, deleteGateway, saveGateway, updateGateway,
            submitEditGatewayForm, rebootGateway, resetGateway
        } = this.props
        const componentProps = {
            gateway, initialDataLoading, deleteGateway, saveGateway,
            updateGateway, submitEditGatewayForm, rebootGateway, resetGateway
        }
        return <GatewayComponent {...componentProps} />
    }

}

const mapStateToProps = (state: IAppState) => ({
    gateway: state.entities.gateway,
    initialDataLoading: state.modules.gateway.initialDataLoading,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    loadGateway: () => dispatch(fetchGateway()),
    saveGateway: (gateway: IGateway) => dispatch(saveGateway(gateway)),
    updateGateway: (gateway: Partial<IGateway>) => dispatch(updateGateway(gateway)),
    deleteGateway: () => dispatch(deleteGateway()),
    rebootGateway: () => dispatch(rebootGateway()),
    resetGateway: () => dispatch(resetGateway()),
    submitEditGatewayForm: () => dispatch(submit(GATEWAY_EDIT_FORM))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(GatewayModule)
