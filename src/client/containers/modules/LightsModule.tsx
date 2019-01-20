import { Tabs } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Sticky, StickyContainer } from 'react-sticky'

import { updateGroup } from '@/actions/groups'
import { fetchLights, lightStateChanged, startLightPolling, stopLightPolling, updateLight } from '@/actions/lights'
import LightGroups from '@/components/lights/LightGroups'
import Lights from '@/components/lights/Lights'
import Tabbed from '@/components/Tabbed'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'
import { TabsProps } from 'antd/lib/tabs'
import { Dictionary, IGroup, IGroupUpdateRequest, ILight } from 'shared/types'

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
        const tabs = [{
            title: 'Lights',
            component: (
                <Lights
                    groups={this.props.groups}
                    lights={this.props.lights}
                    initialDataLoading={this.props.initialDataLoading}
                    lightStateChanged={this.props.lightStateChanged}
                    updateLight={this.props.updateLight}
                />
            )
        }, {
            title: 'Groups',
            component: (
                <LightGroups
                    groups={this.props.groups}
                    lights={this.props.lights}
                    initialDataLoading={this.props.initialDataLoading}
                    lightStateChanged={this.props.lightStateChanged}
                    updateGroup={this.props.updateGroup}
                />
            )
        }]
        return <Tabbed tabs={tabs}/>
    }
}

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
