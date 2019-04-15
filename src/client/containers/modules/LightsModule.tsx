import React, { Component } from 'react'
import { connect } from 'react-redux'

import { updateGroup } from '@/actions/groups'
import { fetchLights, lightStateChanged, updateLight } from '@/actions/lights'
import { addCircadianSettingsGroup, removeCircadianSettingsGroup } from '@/actions/settings'
import LightGroups from '@/components/lights/LightGroups'
import Lights from '@/components/lights/Lights'
import Tabbed from '@/components/Tabbed'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'
import { Dictionary, ICircadianSettings, IGroup, IGroupUpdateRequest, ILight } from 'shared/types'

interface ILightModuleProps {
    groups: Dictionary<IGroup>
    lights: Dictionary<ILight>
    initialDataLoading: boolean
    circadianSettings: ICircadianSettings
    updateLight: (light: ILight) => void
    loadLights: () => void
    lightStateChanged: (light: ILight) => void
    updateGroup: (groupUpdate: IGroupUpdateRequest) => void
    enableCircadian: (groupId: string) => void
    disableCircadian: (groupId: string) => void
}

class LightsModule extends Component<ILightModuleProps> {

    public componentDidMount() {
        this.props.loadLights()
    }

    public render() {
        const tabs = [{
            title: 'Lights',
            component: (
                <Lights
                    groups={this.props.groups}
                    lights={this.props.lights}
                    circadianSettings={this.props.circadianSettings}
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
                    circadianSettings={this.props.circadianSettings}
                    initialDataLoading={this.props.initialDataLoading}
                    lightStateChanged={this.props.lightStateChanged}
                    updateGroup={this.props.updateGroup}
                    enableCircadian={this.props.enableCircadian}
                    disableCircadian={this.props.disableCircadian}
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
    circadianSettings: state.entities.settings.circadian
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    loadLights: () => dispatch(fetchLights()),
    lightStateChanged: (light: ILight) => dispatch(lightStateChanged(light)),
    updateGroup: (group: IGroupUpdateRequest) => dispatch(updateGroup(group)),
    updateLight: (light: ILight) => dispatch(updateLight(light)),
    enableCircadian: (groupId: string) => dispatch(addCircadianSettingsGroup(groupId)),
    disableCircadian: (groupId: string) => dispatch(removeCircadianSettingsGroup(groupId))
})

export default connect(mapStateToProps, mapDispatchToProps)(LightsModule)
