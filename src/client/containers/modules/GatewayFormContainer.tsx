import { connect } from 'react-redux'
import { formValueSelector, getFormSyncErrors, reduxForm } from 'redux-form'

import { discoverGateway, generateIdentity, saveGateway, testConnection } from '@/actions/gateway'
import GatewayForm, { IGatewayFormProps, IGatewayFormValues } from '@/components/gateway/GatewayForm'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'

const GATEWAY_FORM = 'GATEWAY'

const valueSelector = formValueSelector(GATEWAY_FORM)
const validationErrorSelector = getFormSyncErrors(GATEWAY_FORM)

const mapStateToProps = (state: IAppState) => ({
    connectionTestInProgress: state.modules.gateway.connectionTestInProgress,
    connectionTestResult: state.modules.gateway.connectionTestResult,
    discoveredGateway: state.modules.gateway.discoveredGateway,
    discoveryInProgress: state.modules.gateway.discoveryInProgress,
    hostnameValue: valueSelector(state, 'hostname'),
    identityGenerationError: state.modules.gateway.identityGenerationError,
    identityGenerationInProgress: state.modules.gateway.identityGenerationInProgress,
    identityValue: valueSelector(state, 'identity'),
    pskValue: valueSelector(state, 'psk'),
    securityCodeValue: valueSelector(state, 'securityCode'),
    validationErrors: validationErrorSelector(state),
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    discoverGateway: () => dispatch(discoverGateway()),
    generateIdentity: (hostname: string, securityCode: string) => dispatch(generateIdentity(hostname, securityCode)),
    saveGateway: (gateway: IGatewayFormValues) => dispatch(saveGateway(gateway)),
    testConnection: (hostname: string, identity: string, psk: string) =>
        dispatch(testConnection(hostname, identity, psk)),
})

const ReduxForm = reduxForm<IGatewayFormValues, IGatewayFormProps>(
    { form: GATEWAY_FORM, destroyOnUnmount: false })(GatewayForm)

const gatewayFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReduxForm)

export default gatewayFormContainer
