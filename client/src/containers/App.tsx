import { connect as connectSocket, disconnect } from '#/redux-middleware/redux-websocket'
import { Layout, Alert } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import { fetchGroups } from '#/actions/groups'
import Navigation from '#/components/Navigation'
import Routes from '#/components/Routes'
import routeDefs from '#/routeDefs'

import { fetchCircadianSettings } from '#/actions/settings'
import { AppDispatch } from '#/types'
import './App.css'
import { AppState } from '#/reducers'
import { WebsocketConnectionState } from '#/reducers/common'

const { Header, Content, Footer } = Layout

// From Webpack define plugin
declare var VERSION: string | void

const App: React.FC = () => {

    const websocketConnectionState = useSelector<AppState>((state) => state.common.websocketConnectionState)

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(connectSocket(`ws://${window.location.hostname}:${window.location.port}/ws`))

        window.addEventListener('beforeunload', (_event) => {
            dispatch(disconnect())
        })

        dispatch(fetchGroups())
        dispatch(fetchCircadianSettings())
    }, [])

    return (
        <div className='app'>
            <Router>
                <Layout className='app__content'>
                    <Header className='app__header'>
                        <Navigation routes={routeDefs} />
                    </Header>
                    <Content>
                        {websocketConnectionState == WebsocketConnectionState.CONNECTION_LOST &&
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

export default App
