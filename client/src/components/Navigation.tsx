import React from 'react'
import { NavLink } from 'react-router-dom'

import { RouteDefinition } from '@/routeDefs'

import './Navigation.css'

interface NavigationProps {
    routes: RouteDefinition[]
}

const Navigation: React.FC<NavigationProps> = (props) => {
    return (
        <div className='nav-menu'>
            {props.routes.map(renderNavigationLink)}
        </div>
    )
}

const renderNavigationLink = (route: RouteDefinition, index: number) => (
    <NavLink
        className='nav-menu__item'
        activeClassName='nav-menu__item--active'
        key={index}
        to={route.path}
        exact={true}
    >
        <div>
            {route.icon}
        </div>
        <div>
            {route.text}
        </div>
    </NavLink>
)

export default Navigation
