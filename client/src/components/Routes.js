import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'

const Routes = (props) => {
    return (
        props.routes.map((route, index) => (
            <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.container}
            />
        ))
    )
}

Routes.propTypes = {
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            container: PropTypes.element.isRequired,
            exact:  PropTypes.bool.isRequired,
            path: PropTypes.string.isRequired
        })
    ).isRequired
}

export default Routes
