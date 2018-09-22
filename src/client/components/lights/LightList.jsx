import React from 'react'
import { List } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import Spinner from 'components/Spinner'
import LightItem from 'components/lights/LightItem'

import 'components/lights/LightList.css'

const LightList = (props) => (
    <Spinner spinning={props.initialDataLoading}>
        <List itemLayout='vertical'
            dataSource={R.values(props.lights)}
            renderItem={(item) => renderItem(item, props)} />
    </Spinner>
)

const renderItem = (light, { lightStateChanged, updateLight }) => (
    <LightItem key={light.id}
        light={light}
        lightStateChanged={lightStateChanged}
        updateLight={updateLight} />
)

LightList.propTypes = {
    lights: PropTypes.object.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    lightStateChanged: PropTypes.func.isRequired,
    updateLight: PropTypes.func.isRequired
}

export default LightList
