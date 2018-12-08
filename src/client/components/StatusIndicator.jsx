import React from 'react'
import { Tooltip } from 'antd'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import CircleIcon from 'mdi-react/CircleIcon'

import 'components/StatusIndicator.css'

const StatusIndicator = (props) =>  (
    <span className='status'>
        <Tooltip title={title(props)}>
            <CircleIcon
                className={className(props)}
                size={12} />
        </Tooltip>
    </span>
)

const title = ({type, alive, on}) => !alive ? `${capitalizeType(type)} is disconnected` : 
    type !== 'light' ? `${capitalizeType(type)} is on` : 
        on ? `${capitalizeType(type)} is on` : 
            `${capitalizeType(type)} is off`

const className = ({type, alive, on}) => `status__icon ${!alive ? 'status__icon--disconnected' :
    type !== 'light' ? 'status__icon--on' :
        on ? 'status__icon--on' : 'status__icon--off'}`

const capitalizeType = R.cond([
    [R.equals('light'), R.always('Light')],
    [R.equals('sensor'), R.always('Sensor')],
    [R.equals('gateway'), R.always('Gateway')],
    [R.T, R.always('?')]
])

StatusIndicator.propTypes = {
    type: PropTypes.oneOf(['light', 'sensor', 'gateway']),
    alive: PropTypes.bool.isRequired,
    on: PropTypes.bool
}

export default StatusIndicator
