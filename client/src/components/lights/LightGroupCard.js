import React from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'
import LightCard from 'components/lights/LightCard'

import 'components/lights/LightGroupCard.css'

const LightGroupCard = ({ gateway }) => 
    <Card className="group-card" title={gateway.name}>
        {gateway.lights.map((light, idx) =>
            <LightCard key={idx} light={light}/>
        )}
    </Card>

LightGroupCard.propTypes = {
    gateway: PropTypes.object.isRequired,
}

export default LightGroupCard
