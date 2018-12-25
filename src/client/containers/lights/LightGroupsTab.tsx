import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Switch, Slider, List } from 'antd'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import Brightness5Icon from 'mdi-react/Brightness5Icon'
import * as R from 'ramda'
import { lightStateChanged } from 'actions/lights'
import { updateGroup } from 'actions/groups'
import { Group, Light, Dictionary, GroupUpdateRequest } from 'shared/types'

import 'containers/lights/LightGroupsTab.css'
import StatusIndicator from 'components/StatusIndicator'
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const Item = List.Item

const percentFormatter = (v: number) => `${v}%`
const anyLightIsOn = R.any<Light>(R.prop('on'))
const lightBrightnesses = R.map<Light, number>(R.prop('brightness'))
const avgBrightness = R.converge(R.divide, [R.pipe(lightBrightnesses, R.sum), R.length])

interface LightGroupsProps {
    groups: Dictionary<Group>;
    lights: Dictionary<Light>;
    initialDataLoading: boolean;
    lightStateChanged: (light: Light) => void,
    updateGroup: (groupUpdate: GroupUpdateRequest) => void,
}

class LightGroups extends Component<LightGroupsProps> {

    render() {
        return R.values(this.props.groups).map((group, idx) => {
            const groupLights = lightsForGroup(group, this.props.lights)
            return (<Card key={idx} className='light-group__card' title={group.name}>
                {this.lightGroupControls(group, groupLights)}
                <div className='light-group__lights-header'>Lights</div>
                <List 
                    dataSource={groupLights}
                    renderItem={(light: Light) => 
                        <Item>
                            <StatusIndicator type='light' alive={light.alive} on={light.on}/>{light.name}
                        </Item>}
                    bordered={true}
                    size='small' 
                    locale={{ emptyText: 'No lights'}} />
            </Card>)
        })
    }

    lightGroupControls(group: Group, groupLights: Light[]) {
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

    brightnessChanged({ id }: Group, groupLights: Light[], newValue: number) {
        this.props.updateGroup({ id, brightness: newValue})
        for (const light of groupLights) {
            const newLightState = { ...light, brightness: newValue }
            this.props.lightStateChanged(newLightState)
        }
    }

    powerSwitched({ id }: Group, groupLights: Light[], newValue: boolean) {
        this.props.updateGroup({ id, on: newValue})
        for (const light of groupLights) {
            const newLightState = { ...light, on: newValue }
            this.props.lightStateChanged(newLightState)
        }
    }
}

const lightsForGroup = (group: Group, lights: Dictionary<Light>) => R.values(R.pick(R.map(String, group.devices), lights))

// TODO: State type
const mapStateToProps = (state: any) => ({
    groups: state.entities.groups,
    lights: state.entities.lights,
    initialDataLoading: state.modules.lights.initialDataLoading
})

// TODO: State type
const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    lightStateChanged: (light: Light) => dispatch(lightStateChanged(light)),
    updateGroup: (group: GroupUpdateRequest) => dispatch(updateGroup(group))
})

export default connect(mapStateToProps, mapDispatchToProps)(LightGroups)
