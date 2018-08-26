import { connect } from 'react-redux'

import { fetchGateway, startGatewayPolling, stopGatewayPolling, gatewayStateChanged, updateGateway } from 'actions/gateway'

import Gateway from 'components/gateway/Gateway'

const mapStateToProps = state => ({
    gateway: state.entities.gateway,
    initialDataLoading: state.modules.gateway.initialDataLoading
})

const mapDispatchToProps = dispatch => ({
    loadGateway: () => dispatch(fetchGateway()),
    gatewayStateChanged: (gateway) => dispatch(gatewayStateChanged(gateway)),
    startGatewayPolling: () => dispatch(startGatewayPolling()),
    stopGatewayPolling: () => dispatch(stopGatewayPolling()),
    updateGateway: (gatewayId, gateway) => dispatch(updateGateway(gatewayId, gateway))
})

const GatewayModule = connect(
    mapStateToProps,
    mapDispatchToProps
)(Gateway)

export default GatewayModule
