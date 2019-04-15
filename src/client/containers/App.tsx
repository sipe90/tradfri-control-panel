import { connect as connectHook, disconnect } from '@/redux-middleware/redux-websocket'
import { Layout } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import { fetchGroups } from '@/actions/groups'
import Navigation from '@/components/Navigation'
import Routes from '@/components/Routes'
import routeDefs from '@/routeDefs'

import { fetchCircadianSettings } from '@/actions/settings'
import { AppDispatch } from '@/types'
import './App.css'

const { Header, Content, Footer } = Layout

// From Webpack define plugin
declare var VERSION: string | void

interface IAppProps {
    connectWebhook: (url: string) => void
    disconnectWebhook: () => void

    fetchGroups: () => void
    fetchCircadianSettings: () => void
}

class App extends Component<IAppProps> {

    public componentDidMount() {
        this.props.connectWebhook(`ws://${window.location.hostname}:${window.location.port}/ws`)

        window.addEventListener('beforeunload', (_event) => {
            this.props.disconnectWebhook()
        })

        this.props.fetchGroups()
        this.props.fetchCircadianSettings()
    }

    public render() {
        return (
            <div className='app'>
                <Router>
                    <Layout className='app__content'>
                        <Header className='app__header'>
                            <Navigation routes={routeDefs} />
                        </Header>
                        <Content>
                            <Routes routes={routeDefs} />
                        </Content>
                        <Footer className='app__footer'>Trådfri Control Panel {VERSION ? `v${VERSION}` : ''}</Footer>
                    </Layout>
                </Router>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    connectWebhook: (url: string) => dispatch(connectHook(url)),
    disconnectWebhook: () => dispatch(disconnect()),
    fetchGroups: () => dispatch(fetchGroups()),
    fetchCircadianSettings: () => dispatch(fetchCircadianSettings())
})

export default connect(null, mapDispatchToProps)(App)
