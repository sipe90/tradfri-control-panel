import React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import ModuleWrapper from '@/components/ModuleWrapper'
import { IRouteDefinition } from '@/routeDefs'

interface IRoutesProps {
    routes: IRouteDefinition[]
}

const Routes: React.FunctionComponent<IRoutesProps> = (props) => {
    return (
        <Switch>
            <Route exact={true} path='/' render={() => <Redirect to={props.routes[0].path} />} />
            {props.routes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={() => <ModuleWrapper module={route.container} />}
                />
            ))}
            <Route component={() => <ModuleWrapper module={<div>404</div>} />} />
        </Switch>
    )
}

export default Routes
