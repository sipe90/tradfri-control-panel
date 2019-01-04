import { Button, Input, List, Popover, Slider, Switch } from 'antd'
import Brightness5Icon from 'mdi-react/Brightness5Icon'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import PencilIcon from 'mdi-react/PencilIcon'
import ThermometerIcon from 'mdi-react/ThermometerIcon'
import * as R from 'ramda'
import React, { Component } from 'react'

import StatusIndicator from '@/components/StatusIndicator'
import { SliderValue } from 'antd/lib/slider'
import { ILight } from 'shared/types'

import './LightItem.css'

interface ILightItemProps {
    light: ILight
    lightStateChanged: (light: ILight) => void
    updateLight: (light: ILight) => void
}

interface ILightItemState {
    editNameVisible: boolean
    editNameText: string
}

const getDescription = R.cond([
    [R.propEq('spectrum', 'white'), R.always('White spectrum light bulb')],
    [R.propEq('spectrum', 'rgb'), R.always('RGB spectrum light bulb')],
    [R.T, R.always('Light bulb')],
])

const percentFormatter = (v: number) => `${v}%`

const initialState = {
    editNameText: '',
    editNameVisible: false,
}

class LightItem extends Component<ILightItemProps, ILightItemState> {

    constructor(props: Readonly<ILightItemProps>) {
        super(props)
        this.state = initialState
    }

    public render() {
        return (
            <List.Item>
                <List.Item.Meta
                    className='light-item__meta'
                    title={this.title(this.props.light)}
                    description={getDescription(this.props.light)} />
                {this.controlTable(this.props.light)}
            </List.Item>
        )
    }

    private title(light: ILight) {
        return (
            <div className='light-item__title'>
                <StatusIndicator title={statusTitle(light)} status={status(light)}/>
                <span>{light.name}</span>
                <Popover
                    title='Edit name'
                    trigger='click'
                    visible={this.state.editNameVisible}
                    onVisibleChange={this.onEditNameVisibleChanged.bind(this)}
                    content={this.editName()}
                >
                    <span className='light-item__name-edit'>
                        <PencilIcon size={12} />
                    </span>
                </Popover>
            </div>
        )
    }

    private editName() {
        return (
            <div className='light-item__popover'>
                <Input value={this.state.editNameText} onChange={this.editNameChanged.bind(this)} />
                <Button type='primary' size='small' onClick={this.updateName.bind(this)} >Update</Button>
            </div>
        )
    }

    private onEditNameVisibleChanged(visible: boolean) {
        visible && this.setState({ editNameText: this.props.light.name })
        this.setState({ editNameVisible: visible })
    }

    private editNameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ editNameText: event.target.value })
    }

    private updateName() {
        const newLightState = { ...this.props.light, name: this.state.editNameText }
        this.props.updateLight(newLightState)
        this.props.lightStateChanged(newLightState)
        this.setState({ editNameVisible: false })
    }

    private powerSwitched(newValue: boolean) {
        const newLightState = { ...this.props.light, on: newValue }
        this.props.lightStateChanged(newLightState)
        this.props.updateLight(newLightState)
    }

    private brightnessChanged(newValue: number) {
        const newLightState = { ...this.props.light, brightness: newValue }
        this.props.lightStateChanged(newLightState)
        this.props.updateLight(newLightState)
    }

    private temperatureChanged(newValue: number) {
        const newLightState = { ...this.props.light, colorTemperature: newValue }
        this.props.lightStateChanged(newLightState)
        this.props.updateLight(newLightState)
    }

    private controlTable(light: ILight) {
        return (
            <table className='light-item__table'>
                <tbody>
                    <tr>
                        <td><LightbulbOnOutlineIcon size={18} /></td>
                        <td><span>Power</span></td>
                        <td>
                            <Switch
                                size='small'
                                checked={light.on}
                                disabled={!light.switchable || !light.alive}
                                onChange={this.powerSwitched.bind(this)}
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
                                value={light.brightness}
                                disabled={!light.dimmable || !light.alive}
                                onChange={(value: SliderValue) => this.brightnessChanged(value as number)}
                                onAfterChange={() => null}
                                tipFormatter={percentFormatter}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><ThermometerIcon size={18} /></td>
                        <td><span>Temperature</span></td>
                        <td>
                            <Slider
                                min={1}
                                max={100}
                                value={light.colorTemperature}
                                disabled={light.spectrum === 'none' || !light.alive}
                                onChange={(value: SliderValue) => this.temperatureChanged(value as number)}
                                onAfterChange={() => null}
                                tipFormatter={percentFormatter}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

const statusTitle = R.cond([
    [R.propEq('alive', true), R.always('Light is connected')],
    [R.T, R.always('Light is disconnected')]
])

const status = R.cond([
    [R.propEq('alive', true), R.always('online')],
    [R.T, R.always('offline')]
])

export default LightItem
