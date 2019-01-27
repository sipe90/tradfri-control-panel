import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import CircadianSettingsForm, { ICircadianSettingsFormValues } from '@/components/settings/CircadianSettingsForm'
import { IAppState } from '@/reducers'

export const CIRCADIAN_SETTINGS_FORM = 'CIRCADIAN_SETTINGS_FORM'

const mapStateToProps = (state: IAppState) => ({
})

const ReduxForm = reduxForm<ICircadianSettingsFormValues>(
    { form: CIRCADIAN_SETTINGS_FORM })(CircadianSettingsForm)

const CircadianSettingsFormContainer = connect(
    mapStateToProps,
    null,
)(ReduxForm)

export default CircadianSettingsFormContainer
