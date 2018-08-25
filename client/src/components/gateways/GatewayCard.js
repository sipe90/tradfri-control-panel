import React, { Component } from 'react'
import { Button, Card, Tooltip, Popover, Input } from 'antd'
import PropTypes from 'prop-types'
import CircleIcon from 'mdi-react/CircleIcon'
import PencilIcon from 'mdi-react/PencilIcon'

import 'components/gateways/GatewayCard.css'

const { Meta } = Card

class GatewayCard extends Component {

    render() {
        return (
            <div className='gateway-card'>
                <Card
                    cover={this.cardCover(this.props)}>
                    <Meta 
                        title={this.title(this.props)}
                        avatar={this.statusIndicator(this.props)}
                        description='IKEA Trådfri gateway'/>
                </Card>
            </div>
        )
    }

    cardCover({gateway}) {
        return (
            <div className='gateway-card-cover'>
                <Tooltip title={gateway.type}>
                    <img alt={gateway.type} src={'/tradfri_gateway.png'} />
                </Tooltip>
            </div>
        )
    }

    title({gateway}) {
        return (
            <div className='gateway-card-title'>
                <span>{gateway.name}</span>
                <Popover
                    title='Edit name'
                    trigger='click'
                    onVisibleChange={this.onEditNameVisibleChanged.bind(this)}
                    content={this.editName()}
                >
                    <span className='gateway-card-title-edit'>
                        <PencilIcon size={18}/>
                    </span>
                </Popover>
            </div>
        )
    }

    editName() {
        return (
            <div className='gateway-card-title-popover'>
                <Input value={this.props.nameEdit} onChange={this.nameEditChanged.bind(this)} />
                <Button type='primary' size='small'>Update</Button>
            </div>
        )
    }

    statusIndicator({gateway}) {
        return(
            <Tooltip title={gateway.connected ? 'Gateway is online' : 'Gateway is offline'}>
                <CircleIcon className={gateway.connected ? 'color-green' : 'color-red'} size={18}/>
            </Tooltip>
        )
    }

    onEditNameVisibleChanged(visible) {
        visible && this.props.nameEditChanged(this.props.gateway.id, this.props.gateway.name)
    }

    nameEditChanged(event) {
        this.props.nameEditChanged(this.props.gateway.id, event.target.value)
    }
}

GatewayCard.propTypes = {
    gateway: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        connected: PropTypes.bool.isRequired,
        hostname: PropTypes.string.isRequired,
        lights: PropTypes.arrayOf(PropTypes.number).isRequired,
        sensors: PropTypes.arrayOf(PropTypes.number).isRequired
    }),
    nameEdit: PropTypes.string.isRequired,
    gatewayStateChanged: PropTypes.func.isRequired,
    nameEditChanged: PropTypes.func.isRequired,
    updateGateway: PropTypes.func.isRequired
}

export default GatewayCard
