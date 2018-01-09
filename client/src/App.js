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

class App extends Component {
    render() {
        return (
            <Layout>
                <Sider>
                    <div className="App-title">Smart Home Panel</div>
                    <Menu theme="dark">
                        <Menu.Item><FaLightbulbO className="App-menu-icon"/><span>Lights</span></Menu.Item>
                        <Menu.Item><FaPlug className="App-menu-icon"/><span>Sockets</span></Menu.Item>
                        <Menu.Item><FaFeed className="App-menu-icon"/><span>Sensors</span></Menu.Item>
                        <Menu.Item><FaHddO className="App-menu-icon"/><span>Hub</span></Menu.Item>
                        <Menu.Item><FaCog className="App-menu-icon"/><span>Settings</span></Menu.Item>
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
                    <Footer></Footer>
                </Layout>
            </Layout>
        )
    }
}

export default App
