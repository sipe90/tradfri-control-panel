
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { submit } from 'redux-form'

import { fetchCircadianSettings, saveCircadianSettings } from '@/actions/settings'
import Circadian from '@/components/settings/Circadian'
import Tabbed from '@/components/Tabbed'
import { AppDispatch } from '@/types'
import { CIRCADIAN_SETTINGS_FORM } from '@/containers/settings/CircadianSettingsFormContainer'

const SettingsModule: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchCircadianSettings())
    }, [])

    const tabs = [{
        title: 'Circadian',
        component: (
            <Circadian
                updateCircadianSettings={(settings) => dispatch(saveCircadianSettings(settings))}
                submitCircadianSettingsForm={() => dispatch(submit(CIRCADIAN_SETTINGS_FORM))}
            />
        )
    }]
    return <Tabbed tabs={tabs} />
}

export default SettingsModule
