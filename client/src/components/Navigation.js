import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Menu } from 'antd'

import routes from '../routes'

const { Item } = Menu

const Navigation = (props) => {
    return (
        <Menu theme="dark">
            {
                routes.map((route, index) => (
                    <Item key={index}>
                        <Link to={route.path}>
                            <route.icon className="App-menu-icon"/>
                            { !props.collapsed &&
                                <span>{route.text}</span>
                            }
                        </Link>
                    </Item>
                ))
            }
        </Menu>
    )
}

Navigation.propTypes = {
    collapsed: PropTypes.bool.isRequired
}

export default Navigation
