import React from 'react'

import GaugeIcon from 'mdi-react/GaugeIcon'
import LightbulbOutlineIcon from 'mdi-react/LightbulbOutlineIcon'
import RssIcon from 'mdi-react/RssIcon'
import HomeAutomationIcon from 'mdi-react/HomeAutomationIcon'
import SettingsIcon from 'mdi-react/SettingsIcon'

import GatewaysModule from 'containers/modules/GatewaysModule'
import LightsModule from 'containers/modules/LightsModule'
import SensorsModule from 'containers/modules/SensorsModule'

/* eslint-disable  react/display-name */

const routes = [
    { 
        path: '/dashboard',
        exact: true,
        icon: <GaugeIcon size={28}/>,
        text: 'Dashboard',
        container: () => <div>Dashboard</div>
    },
    { 
        path: '/gateways',
        exact: true,
        icon: <HomeAutomationIcon size={28}/>,
        text: 'Gateways',
        container: GatewaysModule
    },
    { 
        path: '/lights',
        exact: true,
        icon: <LightbulbOutlineIcon size={28}/>,
        text: 'Lights',
        container: LightsModule
    },
    { 
        path: '/sensors',
        exact: true,
        icon: <RssIcon size={28}/>,
        text: 'Sensors',
        container: SensorsModule
    },
    { 
        path: '/settings',
        exact: true,
        icon: <SettingsIcon size={28}/>,
        text: 'Settings',
        container:  () => <div>Settings</div>
    }
]

/* eslint-enable react/display-name */

export default routes
