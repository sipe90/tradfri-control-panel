import React from 'react'
import PropTypes from 'prop-types'
import { Card, Collapse, Switch, Slider } from 'antd'
import * as R from 'ramda'

import LightList from 'components/lights/LightList'

const { Panel } = Collapse

const percentFormatter = (v) => `${v}%`

const LightGroups = (props) => (

    R.values(props.groups).map((group, idx) =>
        <Card key={idx} style={{ marginBottom: 8 }} bodyStyle={{ padding: 12 }}>
            <div style={{ marginBottom: 8, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 450 }}>{group.name}</div>
            <LightGroupControls group={group} />
            <Collapse bordered={true} style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
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

const LightGroupControls = (props) => (
    <div>

    </div>
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
