import React from 'react'

import LightbulbOutlineIcon from 'mdi-react/LightbulbOutlineIcon'
import RssIcon from 'mdi-react/RssIcon'
import HomeAutomationIcon from 'mdi-react/HomeAutomationIcon'
import SettingsIcon from 'mdi-react/SettingsIcon'

import GatewayModule from 'containers/modules/GatewayModule'
import LightsModule from 'containers/modules/LightsModule'
import SensorsModule from 'containers/modules/SensorsModule'

export interface RouteDefinition {
    path: string;
    exact: boolean;
    icon: React.ReactNode;
    text: string;
    container: React.ReactNode
}

const routes: RouteDefinition[] = [
    {
        path: '/gateway',
        exact: true,
        icon: <HomeAutomationIcon size={28} />,
        text: 'Gateway',
        container: GatewayModule
    },
    {
        path: '/lights',
        exact: true,
        icon: <LightbulbOutlineIcon size={28} />,
        text: 'Lights',
        container: LightsModule
    },
    {
        path: '/sensors',
        exact: true,
        icon: <RssIcon size={28} />,
        text: 'Sensors',
        container: SensorsModule
    },
    {
        path: '/settings',
        exact: true,
        icon: <SettingsIcon size={28} />,
        text: 'Settings',
        container: () => <div>Settings</div>
    }
]

export default routes
