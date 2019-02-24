
import { fetchCircadianSettings, saveCircadianSettings } from '@/actions/settings'
import Circadian from '@/components/settings/Circadian'
import { ICircadianSettingsFormValues } from '@/components/settings/CircadianSettingsForm'
import Tabbed from '@/components/Tabbed'
import { AppDispatch } from '@/types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormAction, submit } from 'redux-form'
import { CIRCADIAN_SETTINGS_FORM } from '../settings/CircadianSettingsFormContainer'

interface ISettingsModuleProps {
    dispatchFetchCircadianSettings: () => void
    dispatchUpdateCircadianSettings: (settings: ICircadianSettingsFormValues) => Promise<void>
    dispatchSubmitCircadianSettingsForm: () => FormAction
}

class SettingsModule extends Component<ISettingsModuleProps> {

    public componentDidMount = () => {
        this.props.dispatchFetchCircadianSettings()
    }

    public render = () => {
        const tabs = [{
            title: 'Circadian',
            component: (
                <Circadian
                    dispatchUpdateCircadianSettings={this.props.dispatchUpdateCircadianSettings}
                    dispatchSubmitCircadianSettingsForm={this.props.dispatchSubmitCircadianSettingsForm}
                />
            )
        }]
        return <Tabbed tabs={tabs}/>
    }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    dispatchFetchCircadianSettings: () => dispatch(fetchCircadianSettings()),
    dispatchSubmitCircadianSettingsForm: () => dispatch(submit(CIRCADIAN_SETTINGS_FORM)),
    dispatchUpdateCircadianSettings: (settings: ICircadianSettingsFormValues) =>
        dispatch(saveCircadianSettings(settings))
})

export default connect(null, mapDispatchToProps)(SettingsModule)
