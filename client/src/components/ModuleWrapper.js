import React from 'react'
import PropTypes from 'prop-types'

import { Divider } from 'antd'

import 'components/ModuleWrapper.css'

const ModuleWrapper = (props) => {
    return (
        <div className="content-wrap">
            <h1>{props.title}</h1>
            <Divider/>
            <props.module/>
        </div>
    )
}

ModuleWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    module: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
}

export default ModuleWrapper
