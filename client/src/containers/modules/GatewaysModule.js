import { connect } from 'react-redux'

import { fetchGateways, startGatewayPolling, stopGatewayPolling, gatewayStateChanged, nameEditChanged, updateGateway } from 'actions/gateways'

import Gateways from 'components/gateways/Gateways'

const mapStateToProps = state => ({
    gateways: state.entities.gateways,
    nameEdit: state.modules.gateways.nameEdit,
    initialDataLoading: state.modules.gateways.initialDataLoading
})

const mapDispatchToProps = dispatch => ({
    loadGateways: () => dispatch(fetchGateways()),
    gatewayStateChanged: (gateway) => dispatch(gatewayStateChanged(gateway)),
    startGatewayPolling: () => dispatch(startGatewayPolling()),
    stopGatewayPolling: () => dispatch(stopGatewayPolling()),
    nameEditChanged: (gatewayId, name) => dispatch(nameEditChanged(gatewayId, name)),
    updateGateway: (gatewayId, gateway) => dispatch(updateGateway(gatewayId, gateway))
})

const GatewaysModule = connect(
    mapStateToProps,
    mapDispatchToProps
)(Gateways)

export default GatewaysModule
