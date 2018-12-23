import React from 'react'

import Spinner from 'components/Spinner'
import GatewayCard from 'components/gateway/GatewayCard'
import GatewayWizard from 'components/gateway/GatewayWizard'

import 'components/gateway/Gateway.css'
import { Gateway } from 'shared/types';

interface GatewayProps {
    gateway: Gateway
    initialDataLoading: boolean
    gatewayStateChanged: (gateway: Gateway) => void
    saveGateway: (gateway: Gateway) => void
}

const Gateway: React.FunctionComponent<GatewayProps> = (props) =>
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

export default Gateway
