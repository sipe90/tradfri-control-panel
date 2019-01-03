import { Tabs } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Sticky, StickyContainer } from 'react-sticky'

import { fetchLights, startLightPolling, stopLightPolling } from '@/actions/lights'
import LightGroupsTab from '@/containers/lights/LightGroupsTab'
import LightsTab from '@/containers/lights/LightsTab'
import { AppDispatch } from '@/types'
import { TabsProps } from 'antd/lib/tabs'

const TabPane = Tabs.TabPane

interface ILightModuleProps {
    loadLights: () => void
    startLightPolling: () => void
    stopLightPolling: () => void
}

class LightsModule extends Component<ILightModuleProps> {

    public componentDidMount() {
        this.props.loadLights()
        this.props.startLightPolling()
    }

    public componentWillUnmount() {
        this.props.stopLightPolling()
    }

    public render() {
        return (
            <StickyContainer>
                <Tabs
                    style={{ textAlign: 'center' }}
                    animated={{ inkBar: true, tabPane: false }}
                    renderTabBar={renderTabBar}
                >
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

const renderTabBar = (props: TabsProps, DefaultTabBar: any) => (
    <Sticky bottomOffset={80}>
        {({ style }) => <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />}
    </Sticky>
)

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    loadLights: () => dispatch(fetchLights()),
    startLightPolling: () => dispatch(startLightPolling()),
    stopLightPolling: () => dispatch(stopLightPolling()),
})

export default connect(null, mapDispatchToProps)(LightsModule)
