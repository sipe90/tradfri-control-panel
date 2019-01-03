import { Card, List, Slider, Switch } from 'antd'
import * as R from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import Brightness5Icon from 'mdi-react/Brightness5Icon'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'

import { updateGroup } from '@/actions/groups'
import { lightStateChanged } from '@/actions/lights'
import StatusIndicator from '@/components/StatusIndicator'
import { Dictionary, IGroup, IGroupUpdateRequest, ILight } from 'shared/types'

import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'
import './LightGroupsTab.css'

const Item = List.Item

const percentFormatter = (v: number) => `${v}%`
const anyLightIsOn = R.any<ILight>(R.prop('on'))
const lightBrightnesses = R.map<ILight, number>(R.prop('brightness'))
const avgBrightness = R.converge(R.divide, [R.pipe(lightBrightnesses, R.sum), R.length])

interface ILightGroupsProps {
    groups: Dictionary<IGroup>
    lights: Dictionary<ILight>
    initialDataLoading: boolean
    lightStateChanged: (light: ILight) => void,
    updateGroup: (groupUpdate: IGroupUpdateRequest) => void,
}

class LightGroups extends Component<ILightGroupsProps> {

    public render = () =>
        R.values(this.props.groups).map((group, idx) => {
            const groupLights = lightsForGroup(group, this.props.lights)
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
            <StatusIndicator type='light' alive={light.alive} on={light.on}/>{light.name}
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
                        <td><Brightness5Icon size={18} /></td>
                        <td><span>Brightness</span></td>
                        <td>
                            <Slider
                                disabled={!groupLights.length}
                                value={groupLights.length && avgBrightness(groupLights)}
                                min={1}
                                max={100}
                                onChange={(newValue) => this.brightnessChanged(group, groupLights, newValue as number)}
                                onAfterChange={() => null}
                                tipFormatter={percentFormatter}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    private brightnessChanged({ id }: IGroup, groupLights: ILight[], newValue: number) {
        this.props.updateGroup({ id, brightness: newValue})
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
}

const lightsForGroup = (group: IGroup, lights: Dictionary<ILight>) =>
    R.values(R.pick(R.map(String, group.devices), lights))

const mapStateToProps = (state: IAppState) => ({
    groups: state.entities.groups,
    initialDataLoading: state.modules.lights.initialDataLoading,
    lights: state.entities.lights,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    lightStateChanged: (light: ILight) => dispatch(lightStateChanged(light)),
    updateGroup: (group: IGroupUpdateRequest) => dispatch(updateGroup(group)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LightGroups)
