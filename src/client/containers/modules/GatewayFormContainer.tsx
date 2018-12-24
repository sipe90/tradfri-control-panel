import { connect } from 'react-redux'
import { formValueSelector, getFormSyncErrors, reduxForm } from 'redux-form'

import { discoverGateway, generateIdentity, testConnection, saveGateway } from 'actions/gateway'

import GatewayForm, { GatewayFormValues, GatewayFormProps } from 'components/gateway/GatewayForm'
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const GATEWAY_FORM = 'GATEWAY'

const valueSelector = formValueSelector(GATEWAY_FORM)
const validationErrorSelector = getFormSyncErrors(GATEWAY_FORM)

// TODO: State type
const mapStateToProps = (state: any) => ({
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

const mapDispatchToProps = (dispatch: ThunkDispatch<any, undefined, AnyAction>) => ({
    discoverGateway: () => dispatch(discoverGateway()),
    generateIdentity: (hostname: string, securityCode: string) => dispatch(generateIdentity(hostname, securityCode)),
    testConnection: (hostname: string, identity: string, psk: string) => dispatch(testConnection(hostname, identity, psk)),
    saveGateway: (gateway: GatewayFormValues) => dispatch(saveGateway(gateway))
})

const ReduxForm = reduxForm<GatewayFormValues, GatewayFormProps>({ form: GATEWAY_FORM, destroyOnUnmount: false })(GatewayForm)

const GatewayFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReduxForm)

export default GatewayFormContainer
