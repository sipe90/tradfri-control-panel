import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateGroup } from '#/actions/groups'
import { fetchLights, updateLight } from '#/actions/lights'
import { addCircadianSettingsGroup, removeCircadianSettingsGroup } from '#/actions/settings'
import LightGroups from '#/components/lights/LightGroups'
import Lights from '#/components/lights/Lights'
import Tabbed from '#/components/Tabbed'
import { AppState } from '#/reducers'
import { AppDispatch } from '#/types'
import { Dictionary, CircadianSettings, Group, Light } from '@tradfri-control-panel/shared'

const LightsModule: React.FC = () => {

    const groups = useSelector<AppState, Dictionary<Group>>((state) => state.entities.groups)
    const lights = useSelector<AppState, Dictionary<Light>>((state) => state.entities.lights)
    const circadianSettings = useSelector<AppState, CircadianSettings>((state) => state.entities.settings.circadian)
    const initialDataLoading = useSelector<AppState, boolean>((state) => state.modules.lights.initialDataLoading)

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchLights())
    }, [])

    const tabs = [{
        title: 'Lights',
        component: (
            <Lights
                groups={groups}
                lights={lights}
                circadianSettings={circadianSettings}
                initialDataLoading={initialDataLoading}
                updateLight={(light, sync) => dispatch(updateLight(light, sync))}
            />
        )
    }, {
        title: 'Groups',
        component: (
            <LightGroups
                groups={groups}
                lights={lights}
                circadianSettings={circadianSettings}
                initialDataLoading={initialDataLoading}
                updateGroup={(group) => dispatch(updateGroup(group))}
                updateLight={(light, sync) => dispatch(updateLight(light, sync))}
                enableCircadian={(groupId) => dispatch(addCircadianSettingsGroup(groupId))}
                disableCircadian={(groupId) => dispatch(removeCircadianSettingsGroup(groupId))}
            />
        )
    }]
    return <Tabbed tabs={tabs} />
}

export default LightsModule
