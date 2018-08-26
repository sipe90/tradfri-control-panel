import React, { Component } from 'react'
import { Button, Card, Tooltip, Popover, Input } from 'antd'
import PropTypes from 'prop-types'
import CircleIcon from 'mdi-react/CircleIcon'
import PencilIcon from 'mdi-react/PencilIcon'

import * as R from 'ramda'

import 'components/sensors/SensorCard.css'

const { Meta } = Card

const getDescription = R.always('Motion sensor')

const getPicture = R.cond([
    [R.equals('TRADFRI motion sensor'), R.always('motion_sensor.png')],
    [R.T, R.always('motion_sensor.png')]
])

const initialState = {
    editNameVisible: false,
    editNameText: ''
}

class SensorCard extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        return (
            <div className='sensor-card'>
                <Card
                    cover={this.cardCover(this.props)}>
                    <Meta
                        title={this.title(this.props)}
                        avatar={this.statusIndicator(this.props)}
                        description={getDescription(this.props.sensor)} />
                </Card>
            </div>
        )
    }

    cardCover({ sensor }) {
        return (
            <div className='sensor-card-cover'>
                <Tooltip title={sensor.model}>
                    <img alt={sensor.model} src={`/${getPicture(sensor.model)}`} />
                </Tooltip>
            </div>
        )
    }

    title({ sensor }) {
        return (
            <div className='sensor-card-title'>
                <span>{sensor.name}</span>
                <Popover
                    title='Edit name'
                    trigger='click'
                    visible={this.state.editNameVisible}
                    onVisibleChange={this.onEditNameVisibleChanged.bind(this)}
                    content={this.editName()}
                >
                    <span className='sensor-card-title-edit'>
                        <PencilIcon size={18} />
                    </span>
                </Popover>
            </div>
        )
    }

    editName() {
        return (
            <div className='sensor-card-title-popover'>
                <Input value={this.state.editNameText} onChange={this.editNameChanged.bind(this)} />
                <Button type='primary' size='small' onClick={this.updateName.bind(this)} >Update</Button>
            </div>
        )
    }

    statusIndicator({ sensor }) {
        return (
            <Tooltip title={sensor.alive ? 'Sensor is connected' : 'Sensor is disconnected'}>
                <CircleIcon className={sensor.alive ? 'color-green' : 'color-red'} size={18} />
            </Tooltip>
        )
    }

    onEditNameVisibleChanged(visible) {
        visible && this.setState({ editNameText: this.props.sensor.name })
        this.setState({ editNameVisible: visible })
    }

    editNameChanged(event) {
        this.setState({ editNameText: event.target.value })
    }

    updateName() {
        const newSensorState = { ...this.props.sensor, name: this.state.editNameText }
        this.props.updateSensor(newSensorState)
        this.props.sensorStateChanged(newSensorState)
        this.setState({ editNameVisible: false })
    }
}

SensorCard.propTypes = {
    sensor: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        alive: PropTypes.bool.isRequired,
        model: PropTypes.string.isRequired,
        power: PropTypes.number.isRequired,
        battery: PropTypes.number.isRequired,
    }),
    sensorStateChanged: PropTypes.func.isRequired,
    updateSensor: PropTypes.func.isRequired
}

export default SensorCard
