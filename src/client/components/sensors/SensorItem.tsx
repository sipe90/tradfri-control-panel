import React, { Component } from 'react'
import { Button, List, Popover, Input } from 'antd'
import PencilIcon from 'mdi-react/PencilIcon'

import 'components/sensors/SensorItem.css'
import StatusIndicator from 'components/StatusIndicator'
import { Sensor } from 'shared/types'

interface SensorItemProps {
    sensor: Sensor
    sensorStateChanged: (sensor: Sensor) => void
    updateSensor: (sensor: Sensor) => void
}

interface SensorItemState {
    editNameVisible: boolean
    editNameText: string
}

const initialState = {
    editNameVisible: false,
    editNameText: ''
}

class SensorItem extends Component<SensorItemProps, SensorItemState> {

    constructor(props: Readonly<SensorItemProps>) {
        super(props)
        this.state = initialState
    }

    render() {
        return (
            <List.Item>
                <List.Item.Meta
                    title={this.title(this.props.sensor)}
                    description='Motion sensor' />
            </List.Item>
        )
    }

    title(sensor: Sensor) {
        return (
            <div className='sensor-item__title'>
                <StatusIndicator type='sensor' alive={this.props.sensor.alive}/>
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

    onEditNameVisibleChanged(visible: boolean) {
        visible && this.setState({ editNameText: this.props.sensor.name })
        this.setState({ editNameVisible: visible })
    }

    editNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ editNameText: event.target.value })
    }

    updateName() {
        const newSensorState = { ...this.props.sensor, name: this.state.editNameText }
        this.props.updateSensor(newSensorState)
        this.props.sensorStateChanged(newSensorState)
        this.setState({ editNameVisible: false })
    }
}

export default SensorItem
