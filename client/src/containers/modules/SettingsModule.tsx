
import React, { useEffect } from 'react'
import * as R from 'ramda'
import { useDispatch, useSelector } from 'react-redux'

import { fetchCircadianSettings, saveCircadianSettings } from '@/actions/settings'
import Circadian from '@/components/settings/Circadian'
import Tabbed from '@/components/Tabbed'
import { AppDispatch } from '@/types'
import { AppState } from '@/reducers'
import { CircadianSettings, Group } from '@tradfri-control-panel/shared'

const SettingsModule: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchCircadianSettings())
    }, [])

    const circadianGroups = useSelector<AppState, Group[]>((state) => R.values(R.pick(state.entities.settings.circadian.groupIds, state.entities.groups)))
    const settings = useSelector<AppState, CircadianSettings>((state) => state.entities.settings.circadian)

    const tabs = [{
        title: 'Circadian',
        component: (
            <Circadian
                settings={settings}
                circadianGroups={circadianGroups}
                saveSettings={(settings) => dispatch(saveCircadianSettings(settings))}
            />
        )
    }]
    return <Tabbed tabs={tabs} />
}

export default SettingsModule
