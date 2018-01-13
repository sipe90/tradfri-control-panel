import React from 'react'
import { Link } from 'react-router-dom'

import { Menu } from 'antd'

import routes from '../routes'

const { Item } = Menu

const Navigation = () => {
    return (
        <Menu theme="dark">
            {
                routes.map((route, index) => (
                    <Item key={index}>
                        <Link to={route.path}>
                            <route.icon className="App-menu-icon"/>
                            <span>{route.text}</span>
                        </Link>
                    </Item>
                ))
            }
        </Menu>
    )
}

export default Navigation
