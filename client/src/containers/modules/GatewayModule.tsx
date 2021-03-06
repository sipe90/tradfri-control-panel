import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
    deleteGateway, fetchGateway, rebootGateway,
    resetGateway, saveGateway, updateGateway
} from '#/actions/gateway'
import GatewayComponent from '#/components/gateway/Gateway'
import GatewayWizard from '#/components/gateway/wizard/GatewayWizard'
import Spinner from '#/components/Spinner'
import { AppState } from '#/reducers'
import { AppDispatch } from '#/types'

const GatewayModule: React.FC = () => {

    const initialDataLoading = useSelector((state: AppState) => state.modules.gateway.initialDataLoading)
    const gateway = useSelector((state: AppState) => state.entities.gateway)

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchGateway())
    }, [])

    return (
        <Spinner spinning={initialDataLoading}>
            {!initialDataLoading &&
                (!gateway ?
                    <GatewayWizard
                        saveGateway={(gateway) => dispatch(saveGateway(gateway))}
                    /> :
                    <GatewayComponent
                        initialDataLoading={initialDataLoading}
                        gateway={gateway}
                        saveGateway={(gateway) => dispatch(saveGateway(gateway))}
                        updateGateway={(gateway) => dispatch(updateGateway(gateway))}
                        deleteGateway={() => dispatch(deleteGateway())}
                        rebootGateway={() => dispatch(rebootGateway())}
                        resetGateway={() => dispatch(resetGateway())}
                    />
                )}
        </Spinner>
    )
}

export default GatewayModule