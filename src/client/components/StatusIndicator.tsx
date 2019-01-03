import { Tooltip } from 'antd'
import React from 'react'

import CircleIcon from 'mdi-react/CircleIcon'

import './StatusIndicator.css'

export enum StatusColor {
    ONLINE = '#00CC00',
    ON = '',
    OFF = '#C1C1C1',
    DISCONNECTED = '',
    OFFLINE = '#CC0000'
}

interface IStatusIndicatorProps {
    title: string
    color: string
    size?: number
}

const StatusIndicator: React.FunctionComponent<IStatusIndicatorProps> = (props) =>  (
    <span className='status'>
        <Tooltip title={props.title}>
            <CircleIcon
                className='status__icon'
                color={props.color}
                size={props.size}
            />
        </Tooltip>
    </span>
)

StatusIndicator.defaultProps = {
    size: 12
}

export default StatusIndicator
