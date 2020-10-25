import { Button, Input, List, Popover, Slider, Switch, Tooltip } from 'antd'
import Brightness5Icon from 'mdi-react/Brightness5Icon'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import PencilIcon from 'mdi-react/PencilIcon'
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import * as R from 'ramda'
import React, { useState } from 'react'

import ConditionalWrap from '@/components/ConditionalWrap'
import StatusIndicator, { Status } from '@/components/StatusIndicator'
import { Light } from '@tradfri-control-panel/shared'

import './LightItem.css'
import { percentFormatter } from '@/utils'

interface LightItemProps {
    light: Light
    circadianEnabled: boolean
    updateLight: (light: Light, sync: boolean) => void
}

const LightItem: React.FC<LightItemProps> = (props) => {

    const { light, circadianEnabled, updateLight } = props

    const [editNameVisible, setEditNameVisible] = useState(false)
    const [editNameText, setEditNameText] = useState('')

    return (
        <List.Item>
            <List.Item.Meta
                className='light-item__meta'
                title={
                    <div className='light-item__title'>
                        <StatusIndicator title={statusTitle(light)} status={status(light)} />
                        <span>{light.name}</span>
                        <Popover
                            title='Edit name'
                            trigger='click'
                            visible={editNameVisible}
                            onVisibleChange={(visible) => {
                                visible && setEditNameText(light.name)
                                setEditNameVisible(visible)
                            }}
                            content={
                                <div className='light-item__popover'>
                                    <Input value={editNameText} onChange={(event) => setEditNameText(event.target.value)} />
                                    <Button type='primary' size='small' onClick={() => {
                                        updateLight({ ...light, name: editNameText }, true)
                                        setEditNameVisible(false)
                                    }} >Update</Button>
                                </div>
                            }
                        >
                            <span className='light-item__name-edit'>
                                <PencilIcon size={12} />
                            </span>
                        </Popover>
                    </div>
                }
                description={getDescription(light)}
            />
            <ControlTable
                light={light}
                circadianEnabled={circadianEnabled}
                updateLight={updateLight}
            />
        </List.Item>
    )
}

interface ControlTableProps {
    light: Light
    circadianEnabled: boolean
    updateLight: (light: Light, sync: boolean) => void
}

const ControlTable: React.FC<ControlTableProps> = (props) => {

    const { light, circadianEnabled, updateLight } = props

    return (
        <table className='light-item__table'>
            <tbody>
                <tr>
                    <td><LightbulbOnOutlineIcon size={18} /></td>
                    <td><span>Power</span></td>
                    <td>
                        <Switch
                            size='small'
                            defaultChecked={light.on || undefined}
                            disabled={!light.switchable || !light.alive}
                            onChange={(on) => updateLight({ ...light, on }, true)}
                        />
                    </td>
                </tr>
                <tr>
                    <td><Brightness5Icon size={18} /></td>
                    <td><span>Brightness</span></td>
                    <td>
                        <Slider
                            min={1}
                            max={100}
                            defaultValue={light.brightness || undefined}
                            disabled={!light.dimmable || !light.alive}
                            onChange={(brightness: number) => updateLight({ ...light, brightness }, false)}
                            onAfterChange={(brightness: number) => updateLight({ ...light, brightness }, true)}
                            tipFormatter={percentFormatter}
                        />
                    </td>
                </tr>
                <tr>
                    <td><ThermometerIcon size={18} /></td>
                    <td><span>Temperature</span></td>
                    <td>
                        <ConditionalWrap
                            condition={circadianEnabled}
                            wrap={(children) =>
                                <Tooltip
                                    title="Disable circadian feature for this light's group to adjust temperature"
                                >
                                    {children}
                                </Tooltip>}
                        >
                            <div>
                                <Slider
                                    min={1}
                                    max={100}
                                    defaultValue={light.colorTemperature || undefined}
                                    disabled={
                                        light.spectrum === 'none' ||
                                        !light.alive ||
                                        circadianEnabled
                                    }
                                    onChange={(colorTemperature: number) => updateLight({ ...light, colorTemperature }, false)}
                                    onAfterChange={(colorTemperature: number) => updateLight({ ...light, colorTemperature }, true)}
                                    tipFormatter={percentFormatter}
                                />
                            </div>
                        </ConditionalWrap>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

const getDescription = R.cond<Light, string>([
    [R.propEq('spectrum', 'white'), R.always('White spectrum light bulb')],
    [R.propEq('spectrum', 'rgb'), R.always('RGB spectrum light bulb')],
    [R.T, R.always('Light bulb')],
])

const statusTitle = R.cond<Light, string>([
    [R.propEq('alive', true), R.always('Light is connected')],
    [R.T, R.always('Light is disconnected')]
])

const status = R.cond<Light, Status>([
    [R.propEq('alive', true), R.always('online')],
    [R.T, R.always('offline')]
])

export default LightItem
