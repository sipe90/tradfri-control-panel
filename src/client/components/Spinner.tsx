import { Icon, Spin } from 'antd'
import React from 'react'

import './Spinner.css'

interface ISpinnerProps {
    children: React.ReactNode
    spinning: boolean
}

const Spinner: React.FunctionComponent<ISpinnerProps> = (props) => (
    <Spin
        className='spinner'
        spinning={props.spinning}
        indicator={<Icon type='loading' className='spinner__icon' spin={true} />}
    >
        {props.children}
    </Spin>
)

export default Spinner
