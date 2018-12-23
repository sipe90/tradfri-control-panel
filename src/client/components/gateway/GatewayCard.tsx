import React, { Component } from 'react'
import { Button, Card, Popover, Input } from 'antd'
import PencilIcon from 'mdi-react/PencilIcon'
import StatusIndicator from 'components/StatusIndicator'

import 'components/gateway/GatewayCard.css'
import gatewayImage from 'public/images/tradfri_gateway.png'
import { Gateway } from 'shared/types'

const { Meta } = Card

interface GatewayCardProps {
    gateway: Gateway
    gatewayStateChanged: (gateway: Gateway) => void
    saveGateway: (gateway: Gateway) => void
}

interface GatewayCardState {
    editNameVisible: boolean
    editNameText: string
}

const initialState = {
    editNameVisible: false,
    editNameText: ''
}

class GatewayCard extends Component<GatewayCardProps, GatewayCardState> {

    constructor(props: Readonly<GatewayCardProps>) {
        super(props)
        this.state = initialState
    }

    render() {
        return (
            <div className='gateway-card'>
                <Card
                    cover={this.cardCover()}>
                    <Meta
                        title={this.title(this.props.gateway)}
                        avatar={<StatusIndicator type='gateway' alive={this.props.gateway.connected}/>}
                        description='IKEA Trådfri gateway' />
                </Card>
            </div>
        )
    }

    cardCover() {
        return (
            <div className='gateway-card__cover'>
                <img alt='Trådfri gateway' src={gatewayImage} />
            </div>
        )
    }

    title(gateway: Gateway) {
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

    editName() {
        return (
            <div className='gateway-card__popover'>
                <Input value={this.state.editNameText} onChange={this.editNameChanged.bind(this)} />
                <Button type='primary' size='small' onClick={this.updateName.bind(this)}>Update</Button>
            </div>
        )
    }

    onEditNameVisibleChanged(visible: boolean) {
        visible && this.setState({ editNameText: this.props.gateway.name })
        this.setState({ editNameVisible: visible })
    }

    editNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ editNameText: event.target.value })
    }

    updateName() {
        const newGatewayState = { ...this.props.gateway, name: this.state.editNameText }
        this.props.saveGateway(newGatewayState)
        this.props.gatewayStateChanged(newGatewayState)
        this.setState({ editNameVisible: false })
    }
}

export default GatewayCard
