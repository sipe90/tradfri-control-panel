import React from 'react'
import { Spin, Icon, List } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import LightItem from 'components/lights/LightItem'

import 'components/lights/LightList.css'

const LightList = (props) =>
    (
        <Spin spinning={props.initialDataLoading} style={{ marginTop: '240px' }} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
            <List itemLayout='vertical'
                dataSource={R.values(props.lights)}
                renderItem={(item) => renderItem(item, props)} />
        </Spin>
    )

const renderItem = (light, { lightStateChanged, updateLight }) =>
    (
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
