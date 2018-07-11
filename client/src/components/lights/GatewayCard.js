import React from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'

import 'components/lights/GatewayCard.css'

const GatewayCard = ({ gateway, children }) =>
    <div className='gateway-card'>
        <Card title={gateway.name}>
            {children}
        </Card>
    </div>

GatewayCard.propTypes = {
    gateway: PropTypes.object.isRequired,
    children: PropTypes.arrayOf(PropTypes.element).isRequired
}

export default GatewayCard
