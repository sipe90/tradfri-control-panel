import React, { Component } from 'react'
import { Tabs } from 'antd'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky'

import { fetchLights, startLightPolling, stopLightPolling } from '@/actions/lights'

import LightGroupsTab from '@/containers/lights/LightGroupsTab'
import LightsTab from '@/containers/lights/LightsTab'
import { TabsProps } from 'antd/lib/tabs';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const TabPane = Tabs.TabPane

interface LightModuleProps {
    loadLights: () => void
    startLightPolling:  () => void
    stopLightPolling:  () => void
}

class LightsModule extends Component<LightModuleProps> {

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

const renderTabBar = (props: TabsProps, DefaultTabBar: any) => (
    <Sticky bottomOffset={80}>
        {({ style }: { style: React.CSSProperties}) => (
            <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
        )}
    </Sticky>
)

// TODO: State type
const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    loadLights: () => dispatch(fetchLights()),
    startLightPolling: () => dispatch(startLightPolling()),
    stopLightPolling: () => dispatch(stopLightPolling())
})

export default connect(null, mapDispatchToProps)(LightsModule)
