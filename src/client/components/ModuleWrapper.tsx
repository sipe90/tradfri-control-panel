import React from 'react'

import 'components/ModuleWrapper.css'

interface ModuleWrapperProps {
    module: React.ReactNode
}

const ModuleWrapper: React.FunctionComponent<ModuleWrapperProps> = (props) => {
    return (
        <div className="content-wrap">
            {props.module}
        </div>
    )
}

export default ModuleWrapper
