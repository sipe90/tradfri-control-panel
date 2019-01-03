import { Card, List } from 'antd'
import * as R from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { lightStateChanged, updateLight } from '@/actions/lights'
import LightItem from '@/components/lights/LightItem'
import Spinner from '@/components/Spinner'
import { devicesForGroup } from '@/utils'
import { Dictionary, IGroup, ILight } from 'shared/types'

import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'
import './LightsTab.css'

interface ILightsTabProps {
    groups: Dictionary<IGroup>
    lights: Dictionary<ILight>
    initialDataLoading: boolean
    lightStateChanged: (light: ILight) => void
    updateLight: (light: ILight) => void
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

    private renderItem = (light: ILight) => (
        <LightItem
            key={light.id}
            light={light}
            lightStateChanged={this.props.lightStateChanged}
            updateLight={this.props.updateLight}
        />
    )
}

const mapStateToProps = (state: IAppState) => ({
    groups: state.entities.groups,
    initialDataLoading: state.modules.lights.initialDataLoading,
    lights: state.entities.lights,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    lightStateChanged: (light: ILight) => dispatch(lightStateChanged(light)),
    updateLight: (light: ILight) => dispatch(updateLight(light)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LightsTab)
