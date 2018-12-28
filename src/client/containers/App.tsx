import { Layout } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { fetchGroups, startGroupPolling, stopGroupPolling } from '@/actions/groups'
import Navigation from '@/components/Navigation'
import Routes from '@/components/Routes'
import routeDefs from '@/routeDefs'

import './App.css'

const { Header, Content, Footer } = Layout

// From Webpack define plugin
declare var VERSION: string | void

interface IAppProps {
    startGroupPolling: () => void
    stopGroupPolling: () => void
    fetchGroups: () => void
}

class App extends Component<IAppProps> {

    public componentDidMount() {
        this.props.fetchGroups()
        this.props.startGroupPolling()
    }

    public componentWillUnmount() {
        this.props.stopGroupPolling()
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

// TODO: State type
const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    fetchGroups: () => dispatch(fetchGroups()),
    startGroupPolling: () => dispatch(startGroupPolling()),
    stopGroupPolling: () => dispatch(stopGroupPolling()),
})

export default connect(null, mapDispatchToProps)(App)
