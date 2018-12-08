import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, Switch, Slider, Table } from 'antd'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import Brightness5Icon from 'mdi-react/Brightness5Icon'
import * as R from 'ramda'
import { lightStateChanged, updateLight } from 'actions/lights'

import 'containers/lights/LightGroupsTab.css'
import StatusIndicator from 'components/StatusIndicator'

const percentFormatter = (v) => `${v}%`

class LightGroups extends Component {

    render() {
        return R.values(this.props.groups).map((group, idx) =>
            <Card key={idx} className='light-group__card' title={group.name}>
                {this.lightGroupControls()}
                <Table 
                    columns={columns}
                    dataSource={lightsForGroup(group, this.props.lights)}
                    pagination={false}
                    size='small'
                    rowKey='id' />
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

const columns = [{
    title: 'Status',
    render: function renderStatus(light){ return <StatusIndicator type='light' alive={light.alive} on={light.on}/> },
    width: '55px'
}, {
    title: 'Name',
    dataIndex: 'name'
}]

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
