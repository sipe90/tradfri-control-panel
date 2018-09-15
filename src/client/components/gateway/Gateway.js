import React from 'react'
import { Spin, Icon } from 'antd'
import PropTypes from 'prop-types'

import GatewayCard from 'components/gateway/GatewayCard'
import GatewayWizard from 'components/gateway/GatewayWizard'

import 'components/gateway/Gateway.css'

const Gateway = (props) =>
    <div>
        <Spin spinning={props.initialDataLoading} className='spinner' indicator={<Icon type="loading" className='spinner__icon' spin />}>
            {props.gateway ?
                <GatewayCard
                    gateway={props.gateway}
                    gatewayStateChanged={props.gatewayStateChanged}
                    saveGateway={props.saveGateway} />
                :
                <GatewayWizard />}
        </Spin>
    </div>

Gateway.propTypes = {
    gateway: PropTypes.object,
    initialDataLoading: PropTypes.bool.isRequired,
    gatewayStateChanged: PropTypes.func.isRequired,
    saveGateway: PropTypes.func.isRequired,
}

export default Gateway
