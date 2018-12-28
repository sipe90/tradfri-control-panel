import React from 'react'
import { NavLink } from 'react-router-dom'

import { IRouteDefinition } from '@/routeDefs'

import './Navigation.css'

interface INavigationProps {
    routes: IRouteDefinition[]
}

const Navigation: React.FunctionComponent<INavigationProps> = (props) => {
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
