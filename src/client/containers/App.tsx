import { connect as connectSocket, disconnect } from '@/redux-middleware/redux-websocket'
import { Layout, Alert } from 'antd'
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
import { IAppState } from '@/reducers'
import { WebsocketConnectionState } from '@/reducers/common'

const { Header, Content, Footer } = Layout

// From Webpack define plugin
declare var VERSION: string | void

interface IAppProps {
    connectWebsocket: (url: string) => void
    disconnectWebsocket: () => void

    fetchGroups: () => void
    fetchCircadianSettings: () => void

    websocketConnectionState: WebsocketConnectionState;
}

class App extends Component<IAppProps> {

    public componentDidMount() {
        this.props.connectWebsocket(`ws://${window.location.hostname}:${window.location.port}/ws`)

        window.addEventListener('beforeunload', (_event) => {
            this.props.disconnectWebsocket()
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
                            {this.props.websocketConnectionState == WebsocketConnectionState.CONNECTION_LOST &&
                                <Alert
                                    className='app__alert'
                                    type='warning'
                                    showIcon
                                    message='Server connection lost. Attempting to reconnect...'
                                /> 
                            }
                            <Routes routes={routeDefs} />
                        </Content>
                        <Footer className='app__footer'>Trådfri Control Panel {VERSION ? `v${VERSION}` : ''}</Footer>
                    </Layout>
                </Router>
            </div>
        )
    }
}

const mapStateToProps = (state: IAppState) => ({
    websocketConnectionState: state.common.websocketConnectionState
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    connectWebsocket: (url: string) => dispatch(connectSocket(url)),
    disconnectWebsocket: () => dispatch(disconnect()),
    fetchGroups: () => dispatch(fetchGroups()),
    fetchCircadianSettings: () => dispatch(fetchCircadianSettings())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
