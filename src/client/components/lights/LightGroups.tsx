import { Card, List, Slider, Switch } from 'antd'
import * as R from 'ramda'
import React, { Component } from 'react'

import Brightness5Icon from 'mdi-react/Brightness5Icon'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import ThemeLightDarkIcon from 'mdi-react/ThemeLightDarkIcon'

import StatusIndicator from '@/components/StatusIndicator'
import { Dictionary, ICircadianSettings, IGroup, IGroupUpdateRequest, ILight } from 'shared/types'

import './LightGroups.css'
import { lightsForGroup } from '@/utils'

const Item = List.Item

const percentFormatter = (v: number) => `${v}%`
const anyLightIsOn = R.any<ILight>(R.propOr(false, 'on'))
const lightBrightnesses = R.map<ILight, number[]>(R.prop('brightness'))
const avgBrightness = R.converge(R.divide, [R.pipe(lightBrightnesses, R.sum), R.length])

interface ILightGroupsProps {
    groups: Dictionary<IGroup>
    lights: Dictionary<ILight>
    initialDataLoading: boolean
    circadianSettings: ICircadianSettings
    lightStateChanged: (light: ILight) => void
    updateGroup: (groupUpdate: IGroupUpdateRequest) => void
    enableCircadian: (groupId: string) => void
    disableCircadian: (groupId: string) => void
}

class LightGroups extends Component<ILightGroupsProps> {

    public render = () =>
        R.values(this.props.groups).map((group, idx) => {
            const groupLights = lightsForGroup(group, this.props.lights)
            if (group.default && !groupLights.length) return
            return (
                <Card key={idx} className='light-group__card' title={group.name}>
                    {this.lightGroupControls(group, groupLights)}
                    <div className='light-group__lights-header'>Lights</div>
                    <List
                        dataSource={groupLights}
                        renderItem={this.renderLight}
                        bordered={true}
                        size='small'
                        locale={{ emptyText: 'No lights'}}
                    />
                </Card>
            )
        })

    private renderLight = (light: ILight) => (
        <Item>
            <StatusIndicator title={statusTitle(light)} status={status(light)}/>{light.name}
        </Item>
    )

    private lightGroupControls(group: IGroup, groupLights: ILight[]) {
        return (
            <table className='light-group__table'>
                <tbody>
                    <tr>
                        <td><LightbulbOnOutlineIcon size={18} /></td>
                        <td><span>Power</span></td>
                        <td>
                            <Switch
                                disabled={!groupLights.length}
                                checked={anyLightIsOn(groupLights)}
                                size='small'
                                onChange={(newValue) => this.powerSwitched(group, groupLights, newValue)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><ThemeLightDarkIcon size={18} /></td>
                        <td><span>Circadian</span></td>
                        <td>
                            <Switch
                                disabled={!groupLights.length || !this.areCircadianSettingsValid()}
                                checked={this.isCircadianEnabled(group)}
                                size='small'
                                onChange={
                                    (newValue) => newValue ?
                                        this.props.enableCircadian(String(group.id)) :
                                        this.props.disableCircadian(String(group.id))
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><Brightness5Icon size={18} /></td>
                        <td><span>Brightness</span></td>
                        <td>
                            <Slider
                                disabled={!groupLights.length}
                                value={groupLights.length && avgBrightness(groupLights)}
                                min={1}
                                max={100}
                                onChange={(newValue) => this.brightnessChanged(groupLights, newValue as number)}
                                onAfterChange={(newValue) =>
                                    this.props.updateGroup({ id: group.id, brightness: newValue as number})}
                                tipFormatter={percentFormatter}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    private brightnessChanged(groupLights: ILight[], newValue: number) {
        for (const light of groupLights) {
            const newLightState = { ...light, brightness: newValue }
            this.props.lightStateChanged(newLightState)
        }
    }

    private powerSwitched({ id }: IGroup, groupLights: ILight[], newValue: boolean) {
        this.props.updateGroup({ id, on: newValue})
        for (const light of groupLights) {
            const newLightState = { ...light, on: newValue }
            this.props.lightStateChanged(newLightState)
        }
    }

    private areCircadianSettingsValid() {
        const { latitude, longitude } = this.props.circadianSettings
        return !R.isEmpty(latitude) && !R.isEmpty(longitude)
    }

    private isCircadianEnabled({ id }: IGroup) {
        return this.props.circadianSettings.groupIds.includes(String(id))
    }
}

const statusTitle = R.cond([
    [R.propEq('alive', true), R.always('Light is connected')],
    [R.T, R.always('Light is disconnected')]
])

const status = R.cond([
    [R.propEq('alive', true), R.always('online')],
    [R.T, R.always('offline')]
])

export default LightGroups
