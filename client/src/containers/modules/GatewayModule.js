import { connect } from 'react-redux'

import { fetchGateway, startGatewayPolling, stopGatewayPolling, gatewayStateChanged, saveGateway } from 'actions/gateway'

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
    saveGateway: (gatewayId, gateway) => dispatch(saveGateway(gatewayId, gateway))
})

const GatewayModule = connect(
    mapStateToProps,
    mapDispatchToProps
)(Gateway)

export default GatewayModule
