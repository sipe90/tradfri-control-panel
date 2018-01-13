import React, { Component } from 'react'
import { Layout, Menu, Badge, Avatar } from 'antd'
import FaBellO from 'react-icons/lib/fa/bell-o'
import FaLightbulbO from 'react-icons/lib/fa/lightbulb-o'
import FaPlug from 'react-icons/lib/fa/plug'
import FaFeed from 'react-icons/lib/fa/feed'
import FaHddO from 'react-icons/lib/fa/hdd-o'
import FaCog from 'react-icons/lib/fa/cog'
import './App.css'

const { Header, Sider, Content, Footer } = Layout
const { Item } = Menu

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
            <Layout className="App-root">
                <Sider collapsed={this.state.collapsed} collapsedWidth={80} collapsible={true} onCollapse={(collapsed) => this.collapse(collapsed)}>
                    <div className="App-title">Smart Home Panel</div>
                    <Menu theme="dark">
                        <Item>
                            <FaLightbulbO className="App-menu-icon"/>
                            <span>Lights</span>
                        </Item>
                        <Item>
                            <FaPlug className="App-menu-icon"/>
                            <span>Sockets</span>
                        </Item>
                        <Item>
                            <FaFeed className="App-menu-icon"/>
                            <span>Sensors</span>
                        </Item>
                        <Item>
                            <FaHddO className="App-menu-icon"/>
                            <span>Hub</span>
                        </Item>
                        <Item>
                            <FaCog className="App-menu-icon"/>
                            <span>Settings</span>
                        </Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="App-header">
                        <Avatar className="App-header-avatar" size="large">PH</Avatar>
                        <Badge count={5} className="App-header-badge">
                            <FaBellO className="App-header-icon"/>
                        </Badge>
                    </Header>
                    <Content></Content>
                    <Footer className="App-footer">Smart Home Panel ©2018</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default App
