import React from 'react'

import GatewayCard from '@/components/gateway/GatewayCard'
import GatewayWizard from '@/components/gateway/GatewayWizard'
import Spinner from '@/components/Spinner'
import { Gateway } from 'shared/types'

import './Gateway.css'

interface IGatewayProps {
    gateway: Gateway
    initialDataLoading: boolean
    gatewayStateChanged: (gateway: Gateway) => void
    saveGateway: (gateway: Gateway) => void
}

const Gateway: React.FunctionComponent<IGatewayProps> = (props) => (
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
)

export default Gateway
