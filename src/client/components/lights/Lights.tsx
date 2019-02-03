import { Card, List } from 'antd'
import * as R from 'ramda'
import React, { Component } from 'react'

import LightItem from '@/components/lights/LightItem'
import Spinner from '@/components/Spinner'
import { devicesForGroup } from '@/utils'
import { Dictionary, ICircadianSettings, IGroup, ILight } from 'shared/types'

import './Lights.css'

interface ILightsProps {
    groups: Dictionary<IGroup>
    lights: Dictionary<ILight>
    circadianSettings: ICircadianSettings
    initialDataLoading: boolean
    lightStateChanged: (light: ILight) => void
    updateLight: (light: ILight) => void
}

class Lights extends Component<ILightsProps> {

    public render = () => (
        R.values(this.props.groups).map((group, idx) => (
            <Card key={idx} className='lights-tab__card' title={group.name}>
                <Spinner spinning={this.props.initialDataLoading}>
                    <List
                        itemLayout='vertical'
                        dataSource={devicesForGroup(group, this.props.lights)}
                        renderItem={(light: ILight) => this.renderItem(group, light)}
                        locale={{ emptyText: 'No lights'}}
                    />
                </Spinner>
            </Card>
            ),
        )
    )

    private renderItem = (group: IGroup, light: ILight) => (
        <LightItem
            key={light.id}
            light={light}
            circadianEnabled={this.circadianEnabled(group)}
            lightStateChanged={this.props.lightStateChanged}
            updateLight={this.props.updateLight}
        />
    )

    private circadianEnabled = (group: IGroup) =>
        R.includes(String(group.id), this.props.circadianSettings.groupIds)
}

export default Lights
