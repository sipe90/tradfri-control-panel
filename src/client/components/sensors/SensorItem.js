import React, { Component } from 'react'
import { Button, List, Tooltip, Popover, Input } from 'antd'
import PropTypes from 'prop-types'
import CircleIcon from 'mdi-react/CircleIcon'
import PencilIcon from 'mdi-react/PencilIcon'

import * as R from 'ramda'

import 'components/sensors/SensorItem.css'

const getDescription = R.always('Motion sensor')

const initialState = {
    editNameVisible: false,
    editNameText: ''
}

class SensorItem extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        return (
            <List.Item>
                <List.Item.Meta
                    title={this.title(this.props)}
                    description={getDescription(this.props.sensor)} />
            </List.Item>
        )
    }

    title({ sensor }) {
        return (
            <div className='sensor-item__title'>
                {this.statusIndicator(sensor)}
                <span>{sensor.name}</span>
                <Popover
                    title='Edit name'
                    trigger='click'
                    visible={this.state.editNameVisible}
                    onVisibleChange={this.onEditNameVisibleChanged.bind(this)}
                    content={this.editName()}
                >
                    <span className='sensor-item__name-edit'>
                        <PencilIcon size={12} />
                    </span>
                </Popover>
            </div>
        )
    }

    editName() {
        return (
            <div className='sensor-item__popover'>
                <Input value={this.state.editNameText} onChange={this.editNameChanged.bind(this)} />
                <Button type='primary' size='small' onClick={this.updateName.bind(this)} >Update</Button>
            </div>
        )
    }

    statusIndicator(sensor) {
        return (
            <span className='sensor-item__status'>
                <Tooltip title={sensor.alive ? 'Sensor is connected' : 'Sensor is disconnected'}>
                    <CircleIcon
                        className={`.sensor-item__status-icon ${sensor.alive ? 'sensor-item__status-icon--connected' :
                            'sensor-item__status-icon--disconnected'}`}
                        size={12} />
                </Tooltip>
            </span>
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

SensorItem.propTypes = {
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

export default SensorItem
