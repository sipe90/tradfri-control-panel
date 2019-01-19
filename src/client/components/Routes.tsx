import React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { IRouteDefinition } from '@/routeDefs'

import './Routes.css'

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
            {renderModule(<div>404</div>)}
        </Switch>
    )
}

const renderRoutes = (routes: IRouteDefinition[]) =>
    routes.map(({ path, exact, container }, index) => (
        <Route
            key={index}
            path={path}
            exact={exact}
            component={() => renderModule(container)}
        />
    ))

const renderModule = (module: JSX.Element) => <div className='content-wrap'>{module}</div>

export default Routes
