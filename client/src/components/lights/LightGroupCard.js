import React from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import LightCard from 'components/lights/LightCard'

import 'components/lights/LightGroupCard.css'

const LightGroupCard = ({ gateway, lights, lightStateChanged, updateLight }) => 
    <Card className="group-card" title={gateway.name}>
        {R.values(lights).map((light, idx) =>
            <LightCard key={idx} light={light} lightStateChanged={lightStateChanged} updateLight={updateLight}/>
        )}
    </Card>

LightGroupCard.propTypes = {
    gateway: PropTypes.object.isRequired,
    lights: PropTypes.object.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired
}

export default LightGroupCard
