import React from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'

import 'components/lights/LightGroupCard.css'

const LightGroupCard = ({ gateway, children }) => 
    <Card className="group-card" title={gateway.name}>
        {children}
    </Card>

LightGroupCard.propTypes = {
    gateway: PropTypes.object.isRequired,
    children: PropTypes.arrayOf(PropTypes.element).isRequired
}

export default LightGroupCard
