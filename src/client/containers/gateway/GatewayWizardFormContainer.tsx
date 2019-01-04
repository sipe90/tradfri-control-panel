import { connect } from 'react-redux'
import { formValueSelector, getFormSyncErrors, reduxForm } from 'redux-form'

import { discoverGateway, generateIdentity, saveGateway, testConnection } from '@/actions/gateway'
import GatewayWizardForm, {
    IGatewayWizardFormProps,
    IGatewayWizardFormValues
} from '@/components/gateway/GatewayWizardForm'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'

const GATEWAY__WIZARD_FORM = 'GATEWAY_WIZARD'

const valueSelector = formValueSelector<IAppState>(GATEWAY__WIZARD_FORM)
const validationErrorSelector = getFormSyncErrors(GATEWAY__WIZARD_FORM)

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
    saveGateway: (gateway: IGatewayWizardFormValues) => dispatch(saveGateway(gateway)),
    testConnection: (hostname: string, identity: string, psk: string) =>
        dispatch(testConnection(hostname, identity, psk)),
})

const ReduxForm = reduxForm<IGatewayWizardFormValues, IGatewayWizardFormProps>(
    { form: GATEWAY__WIZARD_FORM, destroyOnUnmount: false })(GatewayWizardForm)

const GatewayWizardFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReduxForm)

export default GatewayWizardFormContainer
