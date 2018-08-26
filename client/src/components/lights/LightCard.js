import React, { Component } from 'react'
import { Button, Card, Switch, Slider, Tooltip, Popover, Input } from 'antd'
import PropTypes from 'prop-types'
import CircleIcon from 'mdi-react/CircleIcon'
import PencilIcon from 'mdi-react/PencilIcon'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import Brightness5Icon from 'mdi-react/Brightness5Icon'
import ThermometerIcon from 'mdi-react/ThermometerIcon'

import * as R from 'ramda'

import 'components/lights/LightCard.css'

const { Meta } = Card

const getDescription = R.cond([
    [R.propEq('spectrum', 'white'), R.always('White spectrum light bulb')],
    [R.propEq('spectrum', 'rgb'),  R.always('RGB spectrum light bulb')],
    [R.T,  R.always('Light bulb')]
])

const getPicture = R.cond([
    [R.equals('TRADFRI bulb E27 WS opal 980lm'), R.always('e27_ws_opal_980lm.png')],
    [R.T,  R.always('e27_ws_opal_980lm.png')]
])

const percentFormatter = (v) => `${v}%`

const initialState = {
    editNameVisible: false,
    editNameText: ''
}

class LightCard extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        return (
            <div className='light-card'>
                <Card
                    cover={this.cardCover(this.props)}>
                    <Meta 
                        title={this.title(this.props)}
                        avatar={this.statusIndicator(this.props)}
                        description={getDescription(this.props.light)}/>
                    {this.controlTable(this.props)}
                </Card>
            </div>
        )
    }

    cardCover({light}) {
        return (
            <div className='light-card-cover'>
                <Tooltip title={light.model}>
                    <img alt={light.model} src={`/${getPicture(light.model)}`} />
                </Tooltip>
            </div>
        )
    }

    title({light}) {
        return (
            <div className='light-card-title'>
                <span>{light.name}</span>
                <Popover
                    title='Edit name'
                    trigger='click'
                    visible={this.state.editNameVisible}
                    onVisibleChange={this.onEditNameVisibleChanged.bind(this)}
                    content={this.editName()}
                >
                    <span className='light-card-title-edit'>
                        <PencilIcon size={18}/>
                    </span>
                </Popover>
            </div>
        )
    }

    editName() {
        return (
            <div className='light-card-title-popover'>
                <Input value={this.state.editNameText} onChange={this.editNameChanged.bind(this)} />
                <Button type='primary' size='small' onClick={this.updateName.bind(this)} >Update</Button>
            </div>
        )
    }

    statusIndicator({light}) {
        return(
            <Tooltip title={light.alive ? 'Light is connected' : 'Light is disconnected'}>
                <CircleIcon className={light.alive ? 'color-green' : 'color-red'} size={18}/>
            </Tooltip>
        )
    }

    onEditNameVisibleChanged(visible) {
        visible && this.setState({ editNameText: this.props.light.name })
        this.setState({ editNameVisible: visible })
    }

    editNameChanged(event) {
        this.setState({ editNameText: event.target.value })
    }

    updateName() {
        const newLightState = { ...this.props.light, name: this.state.editNameText }
        this.props.updateLight(this.props.gateway.id, newLightState)
        this.props.lightStateChanged(newLightState)
        this.setState({ editNameVisible: false })
    }

    powerSwitched(newValue) {
        const newLightState = { ...this.props.light, on: newValue }
        this.props.lightStateChanged(newLightState)
        this.props.updateLight(this.props.gateway.id, newLightState)
    }

    brightnessChanged(newValue) {
        const newLightState = { ...this.props.light, brightness: newValue }
        this.props.lightStateChanged(newLightState)
        this.props.updateLight(this.props.gateway.id, newLightState)
    }

    temperatureChanged(newValue) {
        const newLightState = { ...this.props.light, colorTemperature: newValue }
        this.props.lightStateChanged(newLightState)
        this.props.updateLight(this.props.gateway.id, newLightState)
    }

    controlTable({light}) {
        return (            
            <table className='light-card-table'>
                <tbody>
                    <tr>
                        <td><LightbulbOnOutlineIcon/></td>
                        <td><span>Power</span></td>
                        <td>
                            <Switch
                                size='small'
                                checked={light.on}
                                disabled={!light.switchable}
                                onChange={this.powerSwitched.bind(this)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><Brightness5Icon/></td>
                        <td><span>Brightness</span></td>
                        <td>
                            <Slider 
                                min={1}
                                max={100}
                                value={light.brightness}
                                disabled={!light.dimmable}
                                onChange={this.brightnessChanged.bind(this)}
                                onAfterChange={() => null}
                                tipFormatter={percentFormatter}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><ThermometerIcon/></td>
                        <td><span>Temperature</span></td>
                        <td>
                            <Slider
                                min={1}
                                max={100}
                                value={light.colorTemperature}
                                onChange={this.temperatureChanged.bind(this)}
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

LightCard.propTypes = {
    light: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        alive: PropTypes.bool.isRequired,
        on: PropTypes.bool.isRequired,
        switchable: PropTypes.bool.isRequired,
        dimmable: PropTypes.bool.isRequired,
        brightness: PropTypes.number.isRequired,
        model: PropTypes.string.isRequired,
        spectrum: PropTypes.string.isRequired,
        colorTemperature: PropTypes.number,
    }),
    gateway: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        connected: PropTypes.bool.isRequired,
        hostname: PropTypes.string.isRequired,
        lights: PropTypes.arrayOf(PropTypes.number).isRequired,
        sensors: PropTypes.arrayOf(PropTypes.number).isRequired
    }),
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired
}

export default LightCard
