import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Layout } from 'antd'

import { startGroupPolling, stopGroupPolling, fetchGroups } from 'actions/groups'

import Navigation from 'components/Navigation'
import Routes from 'components/Routes'
import './App.css'

import routeDefs from 'routeDefs'

const { Header, Content, Footer } = Layout

class App extends Component {

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

App.propTypes = {
    startGroupPolling: PropTypes.func.isRequired,
    stopGroupPolling: PropTypes.func.isRequired,
    fetchGroups: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
    fetchGroups: () => dispatch(fetchGroups()),
    startGroupPolling: () => dispatch(startGroupPolling()),
    stopGroupPolling: () => dispatch(stopGroupPolling()),
})

export default connect(
    () => ({}),
    mapDispatchToProps
)(App)
