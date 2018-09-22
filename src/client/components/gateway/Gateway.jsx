import React from 'react'
import PropTypes from 'prop-types'

import Spinner from 'components/Spinner'
import GatewayCard from 'components/gateway/GatewayCard'
import GatewayWizard from 'components/gateway/GatewayWizard'

import 'components/gateway/Gateway.css'

const Gateway = (props) =>
    <div>
        <Spinner spinning={props.initialDataLoading}>
            {props.gateway ?
                <GatewayCard
                    gateway={props.gateway}
                    gatewayStateChanged={props.gatewayStateChanged}
                    saveGateway={props.saveGateway} />
                :
                <GatewayWizard />}
        </Spinner>
    </div>

Gateway.propTypes = {
    gateway: PropTypes.object,
    initialDataLoading: PropTypes.bool.isRequired,
    gatewayStateChanged: PropTypes.func.isRequired,
    saveGateway: PropTypes.func.isRequired,
}

export default Gateway
