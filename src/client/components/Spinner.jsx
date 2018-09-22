import React from 'react'
import PropTypes from 'prop-types'
import { Spin, Icon } from 'antd'

const Spinner = (props) => (
    <Spin className='spinner'
        spinning={props.spinning}
        indicator={<Icon type='loading' className='spinner__icon' spin />}>
        {props.children}
    </Spin>
)

Spinner.propTypes = {
    children: PropTypes.node,
    spinning: PropTypes.bool.isRequired
}

export default Spinner
