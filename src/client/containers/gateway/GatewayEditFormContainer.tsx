import * as R from 'ramda'
import { connect } from 'react-redux'
import { getFormSyncErrors, reduxForm } from 'redux-form'

import GatewayEditForm, { IGatewayEditFormValues } from '@/components/gateway/GatewayEditForm'
import { IAppState } from '@/reducers'

export const GATEWAY_EDIT_FORM = 'GATEWAY_EDIT'

const validationErrorSelector = getFormSyncErrors(GATEWAY_EDIT_FORM)

const mapStateToProps = (state: IAppState) => ({
    validationErrors: validationErrorSelector(state),
    initialValues: R.pick(['name', 'hostname'], state.entities.gateway)
})

const ReduxForm = reduxForm<IGatewayEditFormValues>(
    { form: GATEWAY_EDIT_FORM })(GatewayEditForm)

const GatewayEditFormContainer = connect(
    mapStateToProps,
    null,
)(ReduxForm)

export default GatewayEditFormContainer
