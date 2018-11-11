import React from 'react'
import PropTypes from 'prop-types'
import { Card, Collapse, Switch, Slider } from 'antd'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import Brightness5Icon from 'mdi-react/Brightness5Icon'
import * as R from 'ramda'

import LightList from 'components/lights/LightList'

import 'components/lights/LightGroups.css'

const { Panel } = Collapse

const percentFormatter = (v) => `${v}%`

const LightGroups = (props) => (

    R.values(props.groups).map((group, idx) =>
        <Card key={idx} className='light-group__card'>
            <div className='light-group__header'>{group.name}</div>
            <LightGroupControls group={group} />
            <div className='light-group__divider' />
            <Collapse bordered={false} className='light-group__collapse'>
                <Panel header='Lights'>
                    <LightList
                        lights={lightsForGroup(group, props.lights)}
                        initialDataLoading={props.initialDataLoading}
                        lightStateChanged={props.lightStateChanged}
                        updateLight={props.updateLight}
                    />
                </Panel>
            </Collapse> 
        </Card>)
)

const LightGroupControls = ({ group }) => (
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

const lightsForGroup = (group, lights) => R.pick(group.devices, lights)

LightGroups.propTypes = {
    groups: PropTypes.object.isRequired,
    lights: PropTypes.object.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired,
}

export default LightGroups
