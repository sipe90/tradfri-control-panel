import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, Switch, Slider, List } from 'antd'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import Brightness5Icon from 'mdi-react/Brightness5Icon'
import * as R from 'ramda'
import { lightStateChanged } from 'actions/lights'
import { updateGroup } from 'actions/groups'

import 'containers/lights/LightGroupsTab.css'
import StatusIndicator from 'components/StatusIndicator'

const Item = List.Item

const percentFormatter = (v) => `${v}%`
const anyLightIsOn = R.any(R.prop('on'))
const lightBrightnesses = R.map(R.prop('brightness'))
const avgBrightness = R.converge(R.divide, [R.pipe(lightBrightnesses, R.sum), R.length])

class LightGroups extends Component {

    render() {
        return R.values(this.props.groups).map((group, idx) => {
            const groupLights = lightsForGroup(group, this.props.lights)
            return (<Card key={idx} className='light-group__card' title={group.name}>
                {this.lightGroupControls(group, groupLights)}
                <div className='light-group__lights-header'>Lights</div>
                <List 
                    dataSource={groupLights}
                    renderItem={(light) => 
                        <Item>
                            <StatusIndicator type='light' alive={light.alive} on={light.on}/>{light.name}
                        </Item>}
                    bordered={true}
                    size='small' 
                    locale={{ emptyText: 'No lights'}} />
            </Card>)
        })
    }

    lightGroupControls(group, groupLights) {
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
                                onChange={(newValue) => this.brightnessChanged(group, groupLights, newValue)}
                                onAfterChange={() => null}
                                tipFormatter={percentFormatter}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    brightnessChanged(group, groupLights, newValue) {
        this.props.updateGroup({ ...group, brightness: newValue})
        for (const light of groupLights) {
            const newLightState = { ...light, brightness: newValue }
            this.props.lightStateChanged(newLightState)
        }
    }

    powerSwitched(group, groupLights, newValue) {
        this.props.updateGroup({ ...group, on: newValue})
        for (const light of groupLights) {
            const newLightState = { ...light, on: newValue }
            this.props.lightStateChanged(newLightState)
        }
    }
}

const lightsForGroup = (group, lights) => R.values(R.pick(group.devices, lights))

LightGroups.propTypes = {
    groups: PropTypes.object.isRequired,
    lights: PropTypes.object.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    updateGroup: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    groups: state.entities.groups,
    lights: state.entities.lights,
    initialDataLoading: state.modules.lights.initialDataLoading
})

const mapDispatchToProps = dispatch => ({
    lightStateChanged: (light) => dispatch(lightStateChanged(light)),
    updateGroup: (gatewayId, light) => dispatch(updateGroup(gatewayId, light))
})

export default connect(mapStateToProps, mapDispatchToProps)(LightGroups)
