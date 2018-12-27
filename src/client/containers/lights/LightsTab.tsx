import { Card, List } from 'antd'
import R, { Dictionary } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { lightStateChanged, updateLight } from '@/actions/lights'
import LightItem from '@/components/lights/LightItem'
import Spinner from '@/components/Spinner'
import { devicesForGroup } from '@/utils'
import { Group, Light } from 'shared/types'

import './LightsTab.css'

interface ILightsTabProps {
    groups: Dictionary<Group>
    lights: Dictionary<Light>
    initialDataLoading: boolean
    lightStateChanged: (light: Light) => void
    updateLight: (light: Light) => void
}

class LightsTab extends Component<ILightsTabProps> {

    public render = () => (
        R.values(this.props.groups).map((group, idx) => (
            <Card key={idx} className='lights-tab__card' title={group.name}>
                <Spinner spinning={this.props.initialDataLoading}>
                    <List
                        itemLayout='vertical'
                        dataSource={devicesForGroup(group, this.props.lights)}
                        renderItem={this.renderItem}
                        locale={{ emptyText: 'No lights'}}
                    />
                </Spinner>
            </Card>
            ),
        )
    )

    private renderItem = (light: Light) => (
        <LightItem
            key={light.id}
            light={light}
            lightStateChanged={this.props.lightStateChanged}
            updateLight={this.props.updateLight}
        />
    )
}

// TODO: State type
const mapStateToProps = (state: any) => ({
    groups: state.entities.groups,
    initialDataLoading: state.modules.lights.initialDataLoading,
    lights: state.entities.lights,
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    lightStateChanged: (light: Light) => dispatch(lightStateChanged(light)),
    updateLight: (light: Light) => dispatch(updateLight(light)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LightsTab)
