import React from 'react'
import { Card, Switch, Slider } from 'antd'
import PropTypes from 'prop-types'
import FaPencil from 'react-icons/lib/fa/pencil'
import FaPowerOff from 'react-icons/lib/fa/power-off'
import MdBrightnessLow from 'react-icons/lib/md/brightness-low'

import * as R from 'ramda'

import 'components/lights/LightCard.css'

const { Meta } = Card

const getDescription = R.cond([
    [R.propEq('spectrum', 'white'), R.always('White spectrum light bulb')],
    [R.propEq('spectrum', 'rgb'),  R.always('RGB spectrum light bulb')],
    [R.T,  R.always('Light bulb')]
])

const LightCard = ({ light }) => 
    <Card className='light-card' actions={[
        <FaPowerOff key={0} size={16} className={light.on ? 'power-on': 'power-off'}/>,
        <MdBrightnessLow key={1} size={16} className='brightness'/>,
        <div key={2} size={16} className='color' style={{ backgroundColor: `#${light.color}`}}/>
    ]}>
        <Meta title={light.name} avatar={<div className={`color ${light.on ? 'color-green' : 'color-red'}`}/>} description={getDescription(light)}/> 
    </Card>

LightCard.propTypes = {
    light: PropTypes.shape({
        name: PropTypes.string.required
    }),
}

export default LightCard
