import { Button, Card, Input, Popover } from 'antd'
import PencilIcon from 'mdi-react/PencilIcon'
import React, { Component } from 'react'

import StatusIndicator from '@/components/StatusIndicator'
// import * as gatewayImage from 'public/images/tradfri_gateway.png'
import { IGateway } from 'shared/types'

import './GatewayCard.css'

const { Meta } = Card

interface IGatewayCardProps {
    gateway: IGateway
    gatewayStateChanged: (gateway: IGateway) => void
    saveGateway: (gateway: IGateway) => void
}

interface IGatewayCardState {
    editNameVisible: boolean
    editNameText: string
}

const initialState = {
    editNameText: '',
    editNameVisible: false,
}

class GatewayCard extends Component<IGatewayCardProps, IGatewayCardState> {

    constructor(props: Readonly<IGatewayCardProps>) {
        super(props)
        this.state = initialState
    }

    public render() {
        return (
            <div className='gateway-card'>
                <Card
                    cover={this.cardCover()}
                >
                    <Meta
                        title={this.title(this.props.gateway)}
                        avatar={<StatusIndicator type='gateway' alive={this.props.gateway.connected}/>}
                        description='IKEA Trådfri gateway'
                    />
                </Card>
            </div>
        )
    }
// <img alt='Trådfri gateway' src={gatewayImage} />
    private cardCover() {
        return (
            <div className='gateway-card__cover'>

            </div>
        )
    }

    private title(gateway: IGateway) {
        return (
            <div className='gateway-card__title'>
                <span>{gateway.name}</span>
                <Popover
                    title='Edit name'
                    trigger='click'
                    visible={this.state.editNameVisible}
                    onVisibleChange={this.onEditNameVisibleChanged.bind(this)}
                    content={this.editName()}
                >
                    <span className='gateway-card__name-edit'>
                        <PencilIcon size={18} />
                    </span>
                </Popover>
            </div>
        )
    }

    private editName() {
        return (
            <div className='gateway-card__popover'>
                <Input value={this.state.editNameText} onChange={this.editNameChanged.bind(this)} />
                <Button type='primary' size='small' onClick={this.updateName.bind(this)}>Update</Button>
            </div>
        )
    }

    private onEditNameVisibleChanged(visible: boolean) {
        visible && this.setState({ editNameText: this.props.gateway.name })
        this.setState({ editNameVisible: visible })
    }

    private editNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ editNameText: event.target.value })
    }

    private updateName() {
        const newGatewayState = { ...this.props.gateway, name: this.state.editNameText }
        this.props.saveGateway(newGatewayState)
        this.props.gatewayStateChanged(newGatewayState)
        this.setState({ editNameVisible: false })
    }
}

export default GatewayCard
