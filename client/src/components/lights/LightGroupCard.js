import React from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'
import LightCard from 'components/lights/LightCard'

import 'components/lights/LightGroupCard.css'

const LightGroupCard = ({ gateway, updateLight }) => 
    <Card className="group-card" title={gateway.name}>
        {gateway.lights.map((light, idx) =>
            <LightCard key={idx} light={light} updateLight={updateLight}/>
        )}
    </Card>

LightGroupCard.propTypes = {
    gateway: PropTypes.object.isRequired,
    updateLight: PropTypes.func.isRequired
}

export default LightGroupCard
