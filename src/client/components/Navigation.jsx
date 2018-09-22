import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import 'components/Navigation.css'

const Navigation = (props) => {
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

Navigation.propTypes = {
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.oneOfType([
                PropTypes.func.isRequired,
                PropTypes.element.isRequired
            ]),
            text: PropTypes.string.isRequired
        })
    ).isRequired
}

export default Navigation
