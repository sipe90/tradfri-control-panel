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
            <Route
                exact={true}
                path='/'
                component={() => <Redirect to={props.routes[0].path} />}
            />
            {renderRoutes(props.routes)}
            <ModuleWrapper module={<div>404</div>} />
        </Switch>
    )
}

const renderRoutes = (routes: IRouteDefinition[]) =>
    routes.map(({ path, exact, container }, index) => (
        <Route
            key={index}
            path={path}
            exact={exact}
            component={() => <ModuleWrapper module={container} />}
        />
    ))

export default Routes
