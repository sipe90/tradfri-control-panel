import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
    deleteGateway, fetchGateway, rebootGateway,
    resetGateway, saveGateway, updateGateway
} from '@/actions/gateway'
import GatewayComponent from '@/components/gateway/Gateway'
import GatewayWizard from '@/components/gateway/GatewayWizard'
import Spinner from '@/components/Spinner'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'

const GatewayModule: React.FC = () => {

    const initialDataLoading = useSelector((state: IAppState) => state.modules.gateway.initialDataLoading)
    const gateway = useSelector((state: IAppState) => state.entities.gateway)

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchGateway())
    }, [])

    return (
        <Spinner spinning={initialDataLoading}>
            {!initialDataLoading && (!gateway ? <GatewayWizard /> : <GatewayComponent
                initialDataLoading={initialDataLoading}
                gateway={gateway}
                saveGateway={(gateway) => dispatch(saveGateway(gateway))}
                updateGateway={(gateway) => dispatch(updateGateway(gateway))}
                deleteGateway={() => dispatch(deleteGateway())}
                rebootGateway={() => dispatch(rebootGateway())}
                resetGateway={() => dispatch(resetGateway())}
            />)}
        </Spinner>
    )
}

export default GatewayModule