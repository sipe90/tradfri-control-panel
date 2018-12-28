import React from 'react'

import HomeAutomationIcon from 'mdi-react/HomeAutomationIcon'
import LightbulbOutlineIcon from 'mdi-react/LightbulbOutlineIcon'
import RssIcon from 'mdi-react/RssIcon'
import SettingsIcon from 'mdi-react/SettingsIcon'

import GatewayModule from '@/containers/modules/GatewayModule'
import LightsModule from '@/containers/modules/LightsModule'
import SensorsModule from '@/containers/modules/SensorsModule'

export interface IRouteDefinition {
    path: string
    exact: boolean
    icon: JSX.Element
    text: string
    container: JSX.Element
}

const routes: IRouteDefinition[] = [
    {
        container: <GatewayModule />,
        exact: true,
        icon: <HomeAutomationIcon size={28} />,
        path: '/gateway',
        text: 'Gateway',
    },
    {
        container: <LightsModule />,
        exact: true,
        icon: <LightbulbOutlineIcon size={28} />,
        path: '/lights',
        text: 'Lights',
    },
    {
        container: <SensorsModule />,
        exact: true,
        icon: <RssIcon size={28} />,
        path: '/sensors',
        text: 'Sensors',
    },
    {
        container: <div>Settings</div>,
        exact: true,
        icon: <SettingsIcon size={28} />,
        path: '/settings',
        text: 'Settings',
    },
]

export default routes
