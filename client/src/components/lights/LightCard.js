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

class LightCard extends Component {

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
                    onVisibleChange={this.onEditNameVisibleChanged.bind(this)}
                    content={this.editName()}
                >
                    <div className='light-card-title-edit'>
                        <PencilIcon size={18}/>
                    </div>
                </Popover>
            </div>
        )
    }

    editName() {
        return (
            <div className='light-card-title-popover'>
                <Input value={this.props.nameEdit} onChange={this.nameEditChanged.bind(this)} />
                <Button type='primary' size='small'>Update</Button>
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
        visible && this.props.nameEditChanged(this.props.light.id, this.props.light.name)
    }

    nameEditChanged(event) {
        this.props.nameEditChanged(this.props.light.id, event.target.value)
    }

    powerSwitched(newValue) {
        this.props.lightStateChanged({ ...this.props.light, on: newValue })
    }

    brightnessChanged(newValue) {
        this.props.lightStateChanged({ ...this.props.light, brightness: newValue })
    }

    temperatureChanged(newValue) {
        this.props.lightStateChanged({ ...this.props.light, colorTemperature: newValue })
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
                                min={0}
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
                                min={0}
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
    nameEdit: PropTypes.string.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    nameEditChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired
}

export default LightCard
