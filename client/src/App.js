import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Layout, Badge, Avatar } from 'antd'
import FaBellO from 'react-icons/lib/fa/bell-o'

import Navigation from './components/Navigation'
import Routes from './components/Routes'
import './App.css'

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
                <Layout className="App-root">
                    <Sider
                        collapsed={this.state.collapsed}
                        collapsedWidth={80}
                        collapsible={true}
                        onCollapse={(collapsed) => this.collapse(collapsed)}
                    >
                        <div className="App-title">Smart Home Panel</div>
                        <Navigation/>
                    </Sider>
                    <Layout>
                        <Header className="App-header">
                            <Avatar className="App-header-avatar" size="large">PH</Avatar>
                            <Badge count={5} className="App-header-badge">
                                <FaBellO className="App-header-icon"/>
                            </Badge>
                        </Header>
                        <Content>
                            <Routes/>
                        </Content>
                        <Footer className="App-footer">Smart Home Panel ©2018</Footer>
                    </Layout>
                </Layout>
            </Router>
        )
    }
}

export default App
