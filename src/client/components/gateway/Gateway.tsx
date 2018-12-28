import React from 'react'

import GatewayCard from '@/components/gateway/GatewayCard'
import GatewayWizard from '@/components/gateway/GatewayWizard'
import Spinner from '@/components/Spinner'
import { IGateway } from 'shared/types'

import './Gateway.css'

interface IGatewayProps {
    gateway: IGateway
    initialDataLoading: boolean
    gatewayStateChanged: (gateway: IGateway) => void
    saveGateway: (gateway: IGateway) => void
}

const Gateway: React.FunctionComponent<IGatewayProps> = (props) => (
    <div>
        <Spinner spinning={props.initialDataLoading}>
            {!props.initialDataLoading && (!props.gateway ? <GatewayWizard /> : renderGateway(props))}
        </Spinner>
    </div>
)

const renderGateway = ({gateway, gatewayStateChanged, saveGateway}: IGatewayProps) => (
    <GatewayCard
        gateway={gateway}
        gatewayStateChanged={gatewayStateChanged}
        saveGateway={saveGateway}
    />
)

export default Gateway
