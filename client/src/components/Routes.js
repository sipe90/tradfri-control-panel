import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'

import ModuleWrapper from 'components/ModuleWrapper'

const Routes = (props) => {
    return (
        props.routes.map((route, index) => (
            <Route
                key={index}
                path={route.path}
                exact={route.exact}
                render={() => <ModuleWrapper                 
                    title={route.text}
                    module={route.container}
                />}
            />
        ))
    )
}

Routes.propTypes = {
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            container: PropTypes.oneOfType([
                PropTypes.func.isRequired,
                PropTypes.element.isRequired
            ]),
            exact:  PropTypes.bool.isRequired,
            path: PropTypes.string.isRequired
        })
    ).isRequired
}

export default Routes
