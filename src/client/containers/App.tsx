import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Layout } from 'antd'

import { startGroupPolling, stopGroupPolling, fetchGroups } from 'actions/groups'

import Navigation from 'components/Navigation'
import Routes from 'components/Routes'
import './App.css'

import routeDefs from 'routeDefs'
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const { Header, Content, Footer } = Layout

// From Webpack define plugin
declare var VERSION: string | void;

interface AppProps {
    startGroupPolling: () => void;
    stopGroupPolling: () => void;
    fetchGroups: () => Promise<void>;
}

class App extends Component<AppProps> {

    componentDidMount() {
        this.props.fetchGroups()
        this.props.startGroupPolling()
    }

    componentWillUnmount() {
        this.props.stopGroupPolling()
    }

    render() {
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
const mapDispatchToProps = (dispatch: ThunkDispatch<any, null, AnyAction>) => ({
    fetchGroups: () => dispatch(fetchGroups()),
    startGroupPolling: () => dispatch(startGroupPolling()),
    stopGroupPolling: () => dispatch(stopGroupPolling()),
})

export default connect(null, mapDispatchToProps)(App)
