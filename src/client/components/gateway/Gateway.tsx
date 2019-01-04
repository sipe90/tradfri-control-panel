import * as R from 'ramda'
import React from 'react'

import { Button, Card, Divider, Input, Popover } from 'antd'
import { PencilIcon } from 'mdi-react'

import GatewayWizard from '@/components/gateway/GatewayWizard'
import Spinner from '@/components/Spinner'
import StatusIndicator from '@/components/StatusIndicator'
import { GatewayConnectionState, IGateway } from 'shared/types'

import './Gateway.css'

const { Meta } = Card

interface IGatewayProps {
    gateway: IGateway
    initialDataLoading: boolean
    dispatchGatewayStateChanged: (gateway: IGateway) => void
    dispatchSaveGateway: (gateway: IGateway) => void
    dispatchUpdateGateway: (gateway: Partial<IGateway>) => void
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

    private renderGateway = () => (
        <div>
            <div className='gateway__actions'>
                <Button>Edit</Button>
                <Button>Delete</Button>
                <Divider type='vertical' style={{ height: 24, margin: '0px 8px 0px 4px' }} />
                <Button>Reboot</Button>
                <Button type='danger'>Reset</Button>
            </div>
            <Card
                cover={this.cardCover()}
            >
                <Meta
                    title={this.title()}
                    avatar={this.statusIndicator()}
                    description='IKEA Trådfri gateway'
                />
            </Card>
        </div>
    )

    private cardCover() {
        return (
            <div className='gateway__cover'>

            </div>
        )
    }

    private title = () => {
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

    private statusIndicator = () => {
        const connectionState = this.props.gateway.connectionState
        return <StatusIndicator title={statusTitle(connectionState)} status={status(connectionState)}/>
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
        this.props.dispatchUpdateGateway(newGatewayState)
        this.props.dispatchGatewayStateChanged(newGatewayState)
        this.setState({ editNameVisible: false })
    }
}

const statusTitle = R.cond([
    [R.equals(GatewayConnectionState.CONNECTED), R.always('Connected to gateway')],
    [R.equals(GatewayConnectionState.DISCONNECTED), R.always('Gateway connection lost')],
    [R.equals(GatewayConnectionState.OFFLINE), R.always('Gateway is offline')],
    [R.T, R.always('Gateway is offline')]
])

const status = R.cond([
    [R.equals(GatewayConnectionState.CONNECTED), R.always('online')],
    [R.equals(GatewayConnectionState.DISCONNECTED), R.always('disconnected')],
    [R.T, R.always('offline')]
])

export default Gateway
