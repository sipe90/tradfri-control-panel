import { connect } from 'react-redux'
import { formValueSelector, getFormSyncErrors } from 'redux-form'

import { discoverGateway, generateIdentity } from 'actions/gateway'

import GatewayForm from 'components/gateway/GatewayForm'

const valueSelector = formValueSelector('GATEWAY')
const validationErrorSelector = getFormSyncErrors('GATEWAY')

const mapStateToProps = state => ({
    discoveryInProgress: state.modules.gateway.discoveryInProgress,
    identityGenerationInProgress: state.modules.gateway.identityGenerationInProgress,
    identityGenerationError: state.modules.gateway.identityGenerationError,
    discoveredGateway: state.modules.gateway.discoveredGateway,
    securityCodeValue: valueSelector(state, 'securityCode'),
    hostnameValue: valueSelector(state, 'hostname'),
    validationErrors: validationErrorSelector(state)
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
