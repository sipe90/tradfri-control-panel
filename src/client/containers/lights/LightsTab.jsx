import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, List } from 'antd'
import * as R from 'ramda'
import { lightStateChanged, updateLight } from 'actions/lights'

import Spinner from 'components/Spinner'
import LightItem from 'components/lights/LightItem'

import 'containers/lights/LightsTab.css'

class LightsTab extends Component { 
    
    render() {
        return (
            R.values(this.props.groups).map((group, idx) =>
                <Card key={idx} className='lights-tab__card' title={group.name}>
                    <Spinner spinning={this.props.initialDataLoading}>
                        <List itemLayout='vertical'
                            dataSource={lightsForGroup(group, this.props.lights)}
                            renderItem={(item) => renderItem(item, this.props)} />
                    </Spinner>
                </Card>)
        )
    }
}

const lightsForGroup = (group, lights) => R.values(R.pick(group.devices, lights))

const renderItem = (light, { lightStateChanged, updateLight }) => (
    <LightItem key={light.id}
        light={light}
        lightStateChanged={lightStateChanged}
        updateLight={updateLight} />
)

LightsTab.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(LightsTab)
