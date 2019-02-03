import React from 'react'

interface IWrapperProps {
    condition: boolean
    wrap: (childen: React.ReactNode) => React.ReactElement<any>
}

const ConditionalWrap: React.FunctionComponent<IWrapperProps> =
    ({ condition, wrap, children }) => condition ? wrap(children) : <>{children}</>

export default ConditionalWrap
