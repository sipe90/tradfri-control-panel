import React, { Component } from 'react'
import { Button, Card, Tooltip, Popover, Input } from 'antd'
import PropTypes from 'prop-types'
import CircleIcon from 'mdi-react/CircleIcon'
import PencilIcon from 'mdi-react/PencilIcon'

import 'components/gateway/GatewayCard.css'
import gatewayImage from 'images/tradfri_gateway.png'

const { Meta } = Card

const initialState = {
    editNameVisible: false,
    editNameText: ''
}

class GatewayCard extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        return (
            <div className='gateway-card'>
                <Card
                    cover={this.cardCover(this.props)}>
                    <Meta
                        title={this.title(this.props)}
                        avatar={this.statusIndicator(this.props)}
                        description='IKEA Trådfri gateway' />
                </Card>
            </div>
        )
    }

    cardCover({ gateway }) {
        return (
            <div className='gateway-card__cover'>
                <Tooltip title={gateway.type}>
                    <img alt={gateway.type} src={gatewayImage} />
                </Tooltip>
            </div>
        )
    }

    title({ gateway }) {
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

    statusIndicator({ gateway }) {
        return (
            <Tooltip title={gateway.connected ? 'Gateway is online' : 'Gateway is offline'}>
                <CircleIcon
                    className={`gateway-card__status-icon ${gateway.connected ? 'gateway-card__status-icon--connected' :
                        'gateway-card__status-icon--disconnected'}`}
                    size={18} />
            </Tooltip>
        )
    }

    onEditNameVisibleChanged(visible) {
        visible && this.setState({ editNameText: this.props.gateway.name })
        this.setState({ editNameVisible: visible })
    }

    editNameChanged(event) {
        this.setState({ editNameText: event.target.value })
    }

    updateName() {
        const newGatewayState = { ...this.props.gateway, name: this.state.editNameText }
        this.props.saveGateway(newGatewayState)
        this.props.gatewayStateChanged(newGatewayState)
        this.setState({ editNameVisible: false })
    }
}

GatewayCard.propTypes = {
    gateway: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        connected: PropTypes.bool.isRequired,
        hostname: PropTypes.string.isRequired,
        lights: PropTypes.arrayOf(PropTypes.number).isRequired,
        sensors: PropTypes.arrayOf(PropTypes.number).isRequired
    }),
    gatewayStateChanged: PropTypes.func.isRequired,
    saveGateway: PropTypes.func.isRequired
}

export default GatewayCard
