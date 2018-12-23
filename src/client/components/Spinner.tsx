import React from 'react'
import { Spin, Icon } from 'antd'

interface SpinnerProps {
    children: React.ReactNode
    spinning: boolean
}

const Spinner: React.FunctionComponent<SpinnerProps> = (props) => (
    <Spin className='spinner'
        spinning={props.spinning}
        indicator={<Icon type='loading' className='spinner__icon' spin />}>
        {props.children}
    </Spin>
)

export default Spinner
