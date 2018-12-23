import React from 'react'
import { NavLink } from 'react-router-dom'

import 'components/Navigation.css'
import { RouteDefinition } from 'routeDefs';

interface NavigationProps {
    routes: RouteDefinition[]
}

const Navigation: React.FunctionComponent<NavigationProps> = (props) => {
    return (
        <div className='nav-menu'>
            {
                props.routes.map((route, index) => (
                    <NavLink key={index} to={route.path} exact className='nav-menu__item' activeClassName='nav-menu__item--active'>
                        <div>
                            {route.icon}
                        </div>
                        <div>
                            {route.text}
                        </div>
                    </NavLink>
                ))
            }
        </div>
    )
}

export default Navigation
