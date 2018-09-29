import React from 'react'
import PropTypes from 'prop-types'

import 'components/ModuleWrapper.css'

const ModuleWrapper = (props) => {
    return (
        <div className="content-wrap">
            <props.module />
        </div>
    )
}

ModuleWrapper.propTypes = {
    title: PropTypes.string.isRequired,
    module: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
}

export default ModuleWrapper
