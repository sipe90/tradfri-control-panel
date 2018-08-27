import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { discoverGateway, generateIdentity } from 'actions/gateway'

import GatewayForm from 'components/gateway/add-gateway/GatewayForm'

const selector = formValueSelector('GATEWAY')

const mapStateToProps = state => ({
    discoveryInProgress: state.modules.gateway.discoveryInProgress,
    identityGenerationInProgress: state.modules.gateway.identityGenerationInProgress,
    identityGenerationError: state.modules.gateway.identityGenerationError,
    discoveredGateway: state.modules.gateway.discoveredGateway,
    securityCodeValue: selector(state, 'securityCode'),
    hostnameValue: selector(state, 'hostname')
})

const mapDispatchToProps = dispatch => ({
    discoverGateway: () => dispatch(discoverGateway()),
    generateIdentity: (hostname, securityCode) => dispatch(generateIdentity(hostname, securityCode))
})

const GatewayFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GatewayForm)

export default GatewayFormContainer
