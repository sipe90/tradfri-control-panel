import React from 'react'
import { Card, Switch, Slider, Tooltip } from 'antd'
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

const CardCover = ({ light }) =>
    <div style={{ textAlign: 'center', marginTop: '10px'}}>
        <Tooltip title={light.model}>
            <img alt="bulb" src={`/${getPicture(light.model)}`}  width={180} height={180} />
        </Tooltip>
    </div>

const Title = ({ light }) =>
    <div style={{ display: 'flex'}}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis'}}>{light.name}</div>
        <Tooltip title='Edit name'>
            <div style={{ float: 'right', paddingTop: '4px'}}><PencilIcon size={18}/></div>
        </Tooltip>
    </div>

const StatusIndicator = ({ light }) =>
    <Tooltip title={light.alive ? 'Light is connected' : 'Light is disconnected'}>
        <MdBrightness1 className={light.alive ? 'color-green' : 'color-red'}/>
    </Tooltip>

const LightCard = ({ light }) =>
    <Card 
        className='light-card'
        cover={<CardCover light={light}/>}>
        <Meta 
            title={<Title light={light}/>}
            avatar={<StatusIndicator light={light}/>}
            description={getDescription(light)}/>
        <table className='light-card-table'>
            <tbody>
                <tr>
                    <td><LightbulbOnOutlineIcon/></td>
                    <td><span>Power</span></td>
                    <td><Switch size='small' defaultChecked={light.on} disabled={!light.switchable}/></td>
                </tr>
                <tr>
                    <td><Brightness5Icon/></td>
                    <td><span>Brightness</span></td>
                    <td><Slider min={0} max={100} defaultValue={light.brightness} disabled={!light.dimmable} /></td>
                </tr>
                <tr>
                    <td><ThermometerIcon/></td>
                    <td><span>Temperature</span></td>
                    <td><Slider min={0} max={100} defaultValue={light.colorTemperature} /></td>
                </tr>
            </tbody>
        </table>
    </Card>

LightCard.propTypes = {
    light: PropTypes.shape({
        name: PropTypes.string.required
    }),
}

export default LightCard
