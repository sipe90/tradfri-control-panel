import { Tabs } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Sticky, StickyContainer } from 'react-sticky'

import { updateGroup } from '@/actions/groups'
import { fetchLights, lightStateChanged, startLightPolling, stopLightPolling, updateLight } from '@/actions/lights'
import LightGroups from '@/components/lights/LightGroups'
import Lights from '@/components/lights/Lights'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'
import { TabsProps } from 'antd/lib/tabs'
import { Dictionary, IGroup, IGroupUpdateRequest, ILight } from 'shared/types'

const TabPane = Tabs.TabPane

interface ILightModuleProps {
    groups: Dictionary<IGroup>
    lights: Dictionary<ILight>
    initialDataLoading: boolean
    updateLight: (light: ILight) => void
    loadLights: () => void
    startLightPolling: () => void
    stopLightPolling: () => void
    lightStateChanged: (light: ILight) => void,
    updateGroup: (groupUpdate: IGroupUpdateRequest) => void,
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
                        <Lights
                            groups={this.props.groups}
                            lights={this.props.lights}
                            initialDataLoading={this.props.initialDataLoading}
                            lightStateChanged={this.props.lightStateChanged}
                            updateLight={this.props.updateLight}
                        />
                    </TabPane>
                    <TabPane key='2' tab='Groups'>
                        <LightGroups
                            groups={this.props.groups}
                            lights={this.props.lights}
                            initialDataLoading={this.props.initialDataLoading}
                            lightStateChanged={this.props.lightStateChanged}
                            updateGroup={this.props.updateGroup}
                        />
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

const mapStateToProps = (state: IAppState) => ({
    groups: state.entities.groups,
    initialDataLoading: state.modules.lights.initialDataLoading,
    lights: state.entities.lights,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    loadLights: () => dispatch(fetchLights()),
    startLightPolling: () => dispatch(startLightPolling()),
    stopLightPolling: () => dispatch(stopLightPolling()),
    lightStateChanged: (light: ILight) => dispatch(lightStateChanged(light)),
    updateGroup: (group: IGroupUpdateRequest) => dispatch(updateGroup(group)),
    updateLight: (light: ILight) => dispatch(updateLight(light)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LightsModule)
