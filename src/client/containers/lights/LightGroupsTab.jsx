import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, Collapse, Switch, Slider } from 'antd'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import Brightness5Icon from 'mdi-react/Brightness5Icon'
import * as R from 'ramda'
import { lightStateChanged, updateLight } from 'actions/lights'

import 'containers/lights/LightGroupsTab.css'

const { Panel } = Collapse

const percentFormatter = (v) => `${v}%`

class LightGroups extends Component {

    render() {
        return R.values(this.props.groups).map((group, idx) =>
            <Card key={idx} className='light-group__card'>
                <div className='light-group__header'>{group.name}</div>
                {this.lightGroupControls()}
                <div className='light-group__divider' />
                <Collapse bordered={false} className='light-group__collapse'>
                    <Panel header='Lights'>
                    </Panel>
                </Collapse> 
            </Card>)
    }

    lightGroupControls() { 
        return (
            <table className='light-group__table'>
                <tbody>
                    <tr>
                        <td><LightbulbOnOutlineIcon size={18} /></td>
                        <td><span>Power</span></td>
                        <td>
                            <Switch
                                size='small'
                                onChange={() => null}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td><Brightness5Icon size={18} /></td>
                        <td><span>Brightness</span></td>
                        <td>
                            <Slider
                                min={1}
                                max={100}
                                onChange={() => null}
                                onAfterChange={() => null}
                                tipFormatter={percentFormatter}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

const lightsForGroup = (group, lights) => R.values(R.pick(group.devices, lights))

LightGroups.propTypes = {
    groups: PropTypes.object.isRequired,
    lights: PropTypes.object.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    groups: state.entities.groups,
    lights: state.entities.lights,
    initialDataLoading: state.modules.lights.initialDataLoading
})

const mapDispatchToProps = dispatch => ({
    lightStateChanged: (light) => dispatch(lightStateChanged(light)),
    updateLight: (gatewayId, light) => dispatch(updateLight(gatewayId, light))
})

export default connect(mapStateToProps, mapDispatchToProps)(LightGroups)
