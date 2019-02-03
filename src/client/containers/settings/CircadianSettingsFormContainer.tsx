import * as R from 'ramda'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import CircadianSettingsForm, {
    ICircadianSettingsFormProps, ICircadianSettingsFormValues
 } from '@/components/settings/CircadianSettingsForm'
import { IAppState } from '@/reducers'

export const CIRCADIAN_SETTINGS_FORM = 'CIRCADIAN_SETTINGS_FORM'

const mapStateToProps = (state: IAppState) => ({
    groups: R.values(R.pick(R.prop('groupIds', state.entities.settings.circadian), state.entities.groups)),
    initialValues: R.pick(['latitude', 'longitude'], state.entities.settings.circadian || {})
})

const ReduxForm = reduxForm<ICircadianSettingsFormValues, ICircadianSettingsFormProps>(
    { enableReinitialize: true, form: CIRCADIAN_SETTINGS_FORM })(CircadianSettingsForm)

const CircadianSettingsFormContainer = connect(
    mapStateToProps,
    null,
)(ReduxForm)

export default CircadianSettingsFormContainer
