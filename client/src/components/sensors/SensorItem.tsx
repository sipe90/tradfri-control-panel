import { Button, Input, List, Popover } from 'antd'
import PencilIcon from 'mdi-react/PencilIcon'
import * as R from 'ramda'
import React, { useState } from 'react'

import StatusIndicator, { Status } from '#/components/StatusIndicator'
import { Device, Sensor } from '@tradfri-control-panel/shared'

import './SensorItem.css'

interface SensorItemProps {
    sensor: Sensor
    updateSensor: (sensor: Sensor) => void
}

const SensorItem: React.FC<SensorItemProps> = (props) => {

    const { sensor, updateSensor } = props

    const [editNameVisible, setEditNameVisible] = useState(false)
    const [editNameText, setEditNameText] = useState('')

    return (
        <List.Item>
            <List.Item.Meta
                title={
                    <div className='sensor-item__title'>
                        <StatusIndicator title={statusTitle(sensor)} status={status(sensor)} />
                        <span>{sensor.name}</span>
                        <Popover
                            title='Edit name'
                            trigger='click'
                            visible={editNameVisible}
                            onVisibleChange={(visible) => {
                                visible && setEditNameText(sensor.name)
                                setEditNameVisible(visible)
                            }}
                            content={
                                <div className='sensor-item__popover'>
                                    <Input value={editNameText} onChange={(event) => setEditNameText(event.target.value)} />
                                    <Button
                                        type='primary' size='small' onClick={() => {
                                            updateSensor({ ...sensor, name: editNameText })
                                            setEditNameVisible(false)
                                        }}
                                    >Update</Button>
                                </div>
                            }
                        >
                            <span className='sensor-item__name-edit'>
                                <PencilIcon size={12} />
                            </span>
                        </Popover>
                    </div>
                }
                description='Motion sensor'
            />
        </List.Item>
    )
}

const statusTitle = R.cond<Device, string>([
    [R.propEq('alive', true), R.always('Sensor is connected')],
    [R.T, R.always('Sensor is disconnected')]
])

const status = R.cond<Device, Status>([
    [R.propEq('alive', true), R.always('online')],
    [R.T, R.always('offline')]
])

export default SensorItem
