import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, List } from 'antd'
import R, { Dictionary } from 'ramda'
import { lightStateChanged, updateLight } from 'actions/lights'

import Spinner from 'components/Spinner'
import LightItem from 'components/lights/LightItem'

import 'containers/lights/LightsTab.css'
import { Group, Light } from 'shared/types';
import { devicesForGroup } from 'utils';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface LightsTabProps {
    groups: Dictionary<Group>;
    lights: Dictionary<Light>;
    initialDataLoading: boolean;
    lightStateChanged: (light: Light) => void;
    updateLight: (light: Light) => void;
}

class LightsTab extends Component<LightsTabProps> {
    
    render() {
        return (
            R.values(this.props.groups).map((group, idx) =>
                <Card key={idx} className='lights-tab__card' title={group.name}>
                    <Spinner spinning={this.props.initialDataLoading}>
                        <List itemLayout='vertical'
                            dataSource={devicesForGroup(group, this.props.lights)}
                            renderItem={(item: Light) => renderItem(item, this.props)} 
                            locale={{ emptyText: 'No lights'}}/>
                    </Spinner>
                </Card>)
        )
    }
}

const renderItem = (light: Light, { lightStateChanged, updateLight }: LightsTabProps) => (
    <LightItem key={light.id}
        light={light}
        lightStateChanged={lightStateChanged}
        updateLight={updateLight} />
)

// TODO: State type
const mapStateToProps = (state: any) => ({
    groups: state.entities.groups,
    lights: state.entities.lights,
    initialDataLoading: state.modules.lights.initialDataLoading
})

const mapDispatchToProps = (dispatch: ThunkDispatch<any, null, AnyAction>) => ({
    lightStateChanged: (light: Light) => dispatch(lightStateChanged(light)),
    updateLight: (light: Light) => dispatch(updateLight(light))
})

export default connect(mapStateToProps, mapDispatchToProps)(LightsTab)
