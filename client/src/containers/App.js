import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { Layout, Badge, Avatar } from 'antd'
import BellIcon from 'mdi-react/BellIcon'

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
                        <div className="app-title">{this.state.collapsed ? null : 'Trådfri Control Panel'}</div>
                        <Navigation collapsed={this.state.collapsed} routes={routeDefs} />
                    </Sider>
                    <Layout>
                        <Header className="app-header">
                            <Avatar className="app-header-avatar" size="large">PH</Avatar>
                            <Badge count={5} className="app-header-badge">
                                <BellIcon className="app-header-icon" size={28} />
                            </Badge>
                        </Header>
                        <Content>
                            <Route exact path='/' render={() => <Redirect to={routeDefs[0].path} />} />
                            <Routes routes={routeDefs} />
                        </Content>
                        <Footer className="app-footer">Trådfri Control Panel ©2018</Footer>
                    </Layout>
                </Layout>
            </Router>
        )
    }
}

export default App
