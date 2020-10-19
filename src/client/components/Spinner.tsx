import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React from 'react'

import './Spinner.css'

interface SpinnerProps {
    spinning: boolean
}

const Spinner: React.FC<SpinnerProps> = (props) => (
    <Spin
        className='spinner'
        spinning={props.spinning}
        indicator={<LoadingOutlined className='spinner__icon' spin />}
    >
        {props.children}
    </Spin>
)

export default Spinner
