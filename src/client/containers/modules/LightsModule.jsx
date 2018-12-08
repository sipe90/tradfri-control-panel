import React, { Component } from 'react'
import { Tabs } from 'antd'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky'
import PropTypes from 'prop-types'

import { fetchLights, startLightPolling, stopLightPolling } from 'actions/lights'

import LightGroupsTab from 'containers/lights/LightGroupsTab'
import LightsTab from 'containers/lights/LightsTab'

const TabPane = Tabs.TabPane

class LightsModule extends Component {

    componentDidMount() {
        this.props.loadLights()
        this.props.startLightPolling()
    }

    componentWillUnmount() {
        this.props.stopLightPolling()
    }

    render() {
        return (
            <StickyContainer>
                <Tabs style={{ textAlign: 'center' }} 
                    animated={{ inkBar: true, tabPane: false }}
                    renderTabBar={renderTabBar}>
                    <TabPane key='1' tab='Lights'>
                        <LightsTab/>
                    </TabPane>
                    <TabPane key='2' tab='Groups'>
                        <LightGroupsTab/>
                    </TabPane>
                </Tabs>
            </StickyContainer>
        )
    }
}

const renderTabBar = (props, DefaultTabBar) => (
    <Sticky bottomOffset={80}>
        {({ style }) => (
            <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
        )}
    </Sticky>
)

LightsModule.propTypes = {
    loadLights: PropTypes.func.isRequired,
    startLightPolling: PropTypes.func.isRequired,
    stopLightPolling: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
    loadLights: () => dispatch(fetchLights()),
    startLightPolling: () => dispatch(startLightPolling()),
    stopLightPolling: () => dispatch(stopLightPolling())
})

export default connect(null, mapDispatchToProps)(LightsModule)
