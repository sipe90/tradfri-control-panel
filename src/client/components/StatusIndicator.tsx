import { Tooltip } from 'antd'
import React from 'react'

import CircleIcon from 'mdi-react/CircleIcon'

import './StatusIndicator.css'

interface IStatusIndicatorProps {
    title: string
    status: Status
    size?: number
}

type Status = 'online' | 'disconnected' | 'offline'

const statusColors: { [key in Status]: string } = {
    online: '#00CC00',
    disconnected: '#FAAD14',
    offline: '#CC0000'
}

const StatusIndicator: React.FunctionComponent<IStatusIndicatorProps> = (props) =>  (
    <span className='status'>
        <Tooltip title={props.title}>
            <CircleIcon
                className='status__icon'
                color={statusColors[props.status]}
                size={props.size}
            />
        </Tooltip>
    </span>
)

StatusIndicator.defaultProps = {
    size: 12
}

export default StatusIndicator
