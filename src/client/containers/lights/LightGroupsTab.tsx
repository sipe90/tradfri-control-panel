import { Card, List, Slider, Switch } from 'antd'
import * as R from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import Brightness5Icon from 'mdi-react/Brightness5Icon'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'

import { updateGroup } from '@/actions/groups'
import { lightStateChanged } from '@/actions/lights'
import StatusIndicator from '@/components/StatusIndicator'
import { Dictionary, Group, GroupUpdateRequest, Light } from 'shared/types'

import './LightGroupsTab.css'

const Item = List.Item

const percentFormatter = (v: number) => `${v}%`
const anyLightIsOn = R.any<Light>(R.prop('on'))
const lightBrightnesses = R.map<Light, number>(R.prop('brightness'))
const avgBrightness = R.converge(R.divide, [R.pipe(lightBrightnesses, R.sum), R.length])

interface ILightGroupsProps {
    groups: Dictionary<Group>
    lights: Dictionary<Light>
    initialDataLoading: boolean
    lightStateChanged: (light: Light) => void,
    updateGroup: (groupUpdate: GroupUpdateRequest) => void,
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

    private renderLight = (light: Light) => (
        <Item>
            <StatusIndicator type='light' alive={light.alive} on={light.on}/>{light.name}
        </Item>
    )

    private lightGroupControls(group: Group, groupLights: Light[]) {
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

    private brightnessChanged({ id }: Group, groupLights: Light[], newValue: number) {
        this.props.updateGroup({ id, brightness: newValue})
        for (const light of groupLights) {
            const newLightState = { ...light, brightness: newValue }
            this.props.lightStateChanged(newLightState)
        }
    }

    private powerSwitched({ id }: Group, groupLights: Light[], newValue: boolean) {
        this.props.updateGroup({ id, on: newValue})
        for (const light of groupLights) {
            const newLightState = { ...light, on: newValue }
            this.props.lightStateChanged(newLightState)
        }
    }
}

const lightsForGroup = (group: Group, lights: Dictionary<Light>) =>
    R.values(R.pick(R.map(String, group.devices), lights))

// TODO: State type
const mapStateToProps = (state: any) => ({
    groups: state.entities.groups,
    initialDataLoading: state.modules.lights.initialDataLoading,
    lights: state.entities.lights,
})

// TODO: State type
const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    lightStateChanged: (light: Light) => dispatch(lightStateChanged(light)),
    updateGroup: (group: GroupUpdateRequest) => dispatch(updateGroup(group)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LightGroups)
