import React from 'react'

import GatewayWizard from '@/components/gateway/GatewayWizard'
import Spinner from '@/components/Spinner'
import StatusIndicator from '@/components/StatusIndicator'
import { IGateway } from 'shared/types'

import { Button, Card, Input, Popover } from 'antd'
import { PencilIcon } from 'mdi-react'
import './Gateway.css'

const { Meta } = Card

interface IGatewayProps {
    gateway: IGateway
    initialDataLoading: boolean
    dispatchGatewayStateChanged: (gateway: IGateway) => void
    dispatchSaveGateway: (gateway: IGateway) => void
}

interface IGatewayState {
    editNameVisible: boolean
    editNameText: string
}

const initialState = {
    editNameText: '',
    editNameVisible: false,
}

class Gateway extends React.Component<IGatewayProps, IGatewayState> {

    constructor(props: Readonly<IGatewayProps>) {
        super(props)
        this.state = initialState
    }

    public render() {
        const { initialDataLoading, gateway } = this.props
        return(
            <div>
                <Spinner spinning={initialDataLoading}>
                    {!initialDataLoading && (!gateway ? <GatewayWizard /> : this.renderGateway())}
                </Spinner>
            </div>
        )
    }

    private renderGateway() {
        const { gateway } = this.props
        return (
        <div className='gateway'>
            <Card
                cover={this.cardCover()}
            >
                <Meta
                    title={this.title()}
                    avatar={<StatusIndicator type='gateway' alive={gateway.connected}/>}
                    description='IKEA Trådfri gateway'
                />
            </Card>
        </div>
    )
    }

    private cardCover() {
        return (
            <div className='gateway__cover'>

            </div>
        )
    }

    private title() {
        const { gateway } = this.props
        return (
            <div className='gateway__title'>
                <span>{gateway.name}</span>
                <Popover
                    title='Edit name'
                    trigger='click'
                    visible={this.state.editNameVisible}
                    onVisibleChange={this.onEditNameVisibleChanged}
                    content={this.editName()}
                >
                    <span className='gateway__name-edit'>
                        <PencilIcon size={18} />
                    </span>
                </Popover>
            </div>
        )
    }

    private editName = () => {
        return (
            <div className='gateway__popover'>
                <Input value={this.state.editNameText} onChange={this.editNameChanged} />
                <Button type='primary' size='small' onClick={this.updateName}>Update</Button>
            </div>
        )
    }

    private onEditNameVisibleChanged = (visible: boolean) => {
        visible && this.setState({ editNameText: this.props.gateway.name })
        this.setState({ editNameVisible: visible })
    }

    private editNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ editNameText: event.target.value })
    }

    private updateName = () => {
        const newGatewayState = { ...this.props.gateway, name: this.state.editNameText }
        this.props.dispatchSaveGateway(newGatewayState)
        this.props.dispatchGatewayStateChanged(newGatewayState)
        this.setState({ editNameVisible: false })
    }
}

export default Gateway
