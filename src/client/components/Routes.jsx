import React from 'react'
import { Route, Redirect, Switch } from 'react-router'
import PropTypes from 'prop-types'

import ModuleWrapper from 'components/ModuleWrapper'

const Routes = (props) => {
    return (
        <Switch>
            <Route exact path='/' render={() => <Redirect to={props.routes[0].path} />} />
            {props.routes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={() => <ModuleWrapper
                        module={route.container}
                    />}
                />
            ))}
            <Route component={() => <ModuleWrapper
                title={'Not found'}
                module={() => <div>404</div>}
            />}
            />
        </Switch>
    )
}

Routes.propTypes = {
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            container: PropTypes.oneOfType([
                PropTypes.func.isRequired,
                PropTypes.element.isRequired
            ]),
            exact: PropTypes.bool.isRequired,
            path: PropTypes.string.isRequired
        })
    ).isRequired
}

export default Routes
