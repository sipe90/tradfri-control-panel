import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Layout, Badge, Avatar } from 'antd'
import FaBellO from 'react-icons/lib/fa/bell-o'

import Navigation from 'components/Navigation'
import Routes from 'components/Routes'
import './App.css'

import routeDefs from 'routeDefs'

const { Header, Sider, Content, Footer } = Layout

class App extends Component {

    constructor() {
        super()

        this.state = {
            collapsed: false
        }
    }

    collapse(collapsed) {
        this.setState({ collapsed: collapsed })
    }

    render() {
        return (
            <Router>
                <Layout className="app-root">
                    <Sider
                        collapsed={this.state.collapsed}
                        collapsedWidth={80}
                        collapsible={true}
                        onCollapse={this.collapse.bind(this)}
                    >
                        <div className="app-title">{this.state.collapsed ? null : 'Smart Home Panel'}</div>
                        <Navigation collapsed={this.state.collapsed} routes={routeDefs}/>
                    </Sider>
                    <Layout>
                        <Header className="app-header">
                            <Avatar className="app-header-avatar" size="large">PH</Avatar>
                            <Badge count={5} className="app-header-badge">
                                <FaBellO className="app-header-icon"/>
                            </Badge>
                        </Header>
                        <Content>
                            <Routes routes={routeDefs}/>
                        </Content>
                        <Footer className="app-footer">Smart Home Panel ©2018</Footer>
                    </Layout>
                </Layout>
            </Router>
        )
    }
}

export default App
