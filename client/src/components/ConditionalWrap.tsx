import React from 'react'

interface WrapperProps {
    condition: boolean
    wrap: (childen: React.ReactNode) => React.ReactElement<any>
}

const ConditionalWrap: React.FC<WrapperProps> =
    ({ condition, wrap, children }) => condition ? wrap(children) : <>{children}</>

export default ConditionalWrap
