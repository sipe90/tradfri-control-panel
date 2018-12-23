import React from 'react'
import { Redirect, Switch, Route } from 'react-router'

import ModuleWrapper from 'components/ModuleWrapper'
import { RouteDefinition } from 'routeDefs';

interface RoutesProps {
    routes: RouteDefinition[];
}

const Routes: React.FunctionComponent<RoutesProps> = (props) => {
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
                module={<div>404</div>}
            />}
            />
        </Switch>
    )
}

export default Routes
