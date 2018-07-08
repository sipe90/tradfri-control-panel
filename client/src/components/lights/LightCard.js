import React, { Component } from 'react'
import { Button, Card, Switch, Slider, Tooltip, Popover, Input } from 'antd'
import PropTypes from 'prop-types'
import MdBrightness1 from 'react-icons/lib/md/brightness-1'
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
            <Card 
                className='light-card'
                cover={this.cardCover(this.props)}>
                <Meta 
                    title={this.title(this.props)}
                    avatar={this.statusIndicator(this.props)}
                    description={getDescription(this.props)}/>
                {this.controlTable(this.props)}
            </Card>
        )
    }

    cardCover({light}) {
        return (
            <div style={{ textAlign: 'center', marginTop: '10px'}}>
                <Tooltip title={light.model}>
                    <img alt="bulb" src={`/${getPicture(light.model)}`}  width={180} height={180} />
                </Tooltip>
            </div>
        )
    }

    title({light}) {
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis'}}>{light.name}</div>
                <Popover title='Edit name' trigger='click' content={this.editName(light)} >
                    <div style={{ float: 'right', paddingTop: '4px'}}>
                        <PencilIcon size={18}/>
                    </div>
                </Popover>
            </div>
        )
    }

    editName(light) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <Input defaultValue={light.name} />
                <Button type='primary' size='small' style={{ marginTop: '12px', width: '40%' }}>Update</Button>
            </div>
        )
    }

    statusIndicator({light}) {
        return(
            <Tooltip title={light.alive ? 'Light is connected' : 'Light is disconnected'}>
                <MdBrightness1 className={light.alive ? 'color-green' : 'color-red'}/>
            </Tooltip>
        )
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
                                defaultChecked={light.on}
                                disabled={!light.switchable}
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
                                defaultValue={light.brightness}
                                disabled={!light.dimmable}
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
                                defaultValue={light.colorTemperature}
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
    updateLight: PropTypes.func.isRequired
}

export default LightCard
