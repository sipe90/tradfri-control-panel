import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { Layout } from 'antd'

import Navigation from 'components/Navigation'
import Routes from 'components/Routes'
import './App.css'

import routeDefs from 'routeDefs'

const { Header, Content, Footer } = Layout

class App extends Component {

    render() {
        return (
            <div className='app-root'>
                <Router>
                    <Layout className="app-content">
                        <Header className="app-header">
                            <Navigation routes={routeDefs} />
                        </Header>
                        <Content>
                            <Route exact path='/' render={() => <Redirect to={routeDefs[0].path} />} />
                            <Routes routes={routeDefs} />
                        </Content>
                        <Footer className="app-footer">Trådfri Control Panel ©2018</Footer>
                    </Layout>
                </Router>
            </div>
        )
    }
}

export default App
