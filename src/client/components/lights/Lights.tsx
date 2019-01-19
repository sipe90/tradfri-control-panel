import { Card, List } from 'antd'
import * as R from 'ramda'
import React, { Component } from 'react'

import LightItem from '@/components/lights/LightItem'
import Spinner from '@/components/Spinner'
import { devicesForGroup } from '@/utils'
import { Dictionary, IGroup, ILight } from 'shared/types'

import './Lights.css'

interface ILightsProps {
    groups: Dictionary<IGroup>
    lights: Dictionary<ILight>
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

export default Lights
