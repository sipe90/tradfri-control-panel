import { connect } from 'react-redux'
import { formValueSelector, getFormSyncErrors, reduxForm } from 'redux-form'

import { discoverGateway, generateIdentity, testConnection, saveGateway } from 'actions/gateway'

import GatewayForm from 'components/gateway/GatewayForm'

const GATEWAY_FORM = 'GATEWAY'

const valueSelector = formValueSelector(GATEWAY_FORM)
const validationErrorSelector = getFormSyncErrors(GATEWAY_FORM)

const mapStateToProps = state => ({
    discoveryInProgress: state.modules.gateway.discoveryInProgress,
    identityGenerationInProgress: state.modules.gateway.identityGenerationInProgress,
    connectionTestInProgress: state.modules.gateway.connectionTestInProgress,
    identityGenerationError: state.modules.gateway.identityGenerationError,
    discoveredGateway: state.modules.gateway.discoveredGateway,
    connectionTestResult: state.modules.gateway.connectionTestResult,
    securityCodeValue: valueSelector(state, 'securityCode'),
    hostnameValue: valueSelector(state, 'hostname'),
    identityValue: valueSelector(state, 'identity'),
    pskValue: valueSelector(state, 'psk'),
    validationErrors: validationErrorSelector(state)
})

const mapDispatchToProps = dispatch => ({
    discoverGateway: () => dispatch(discoverGateway()),
    generateIdentity: (hostname, securityCode) => dispatch(generateIdentity(hostname, securityCode)),
    testConnection: (hostname, identity, psk) => dispatch(testConnection(hostname, identity, psk)),
    saveGateway: (gateway) => dispatch(saveGateway(gateway))
})

const ReduxForm = reduxForm({ form: GATEWAY_FORM, destroyOnUnmount: false })(GatewayForm)

const GatewayFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReduxForm)

export default GatewayFormContainer
