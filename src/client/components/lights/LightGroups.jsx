import React from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'antd'
import * as R from 'ramda'

import LightList from 'components/lights/LightList'

const { Panel } = Collapse

const LightGroups = (props) => (
    <Collapse bordered={false}>
        {R.values(props.groups).map((group, idx) =>
            <Panel key={idx} header={group.name}>
                <LightList
                    lights={lightsForGroup(group, props.lights)}
                    initialDataLoading={props.initialDataLoading}
                    lightStateChanged={props.lightStateChanged}
                    updateLight={props.updateLight}
                />
            </Panel>)}
    </Collapse>
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
