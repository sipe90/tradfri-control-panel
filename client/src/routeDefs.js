import React from 'react'

import FaDashboard from 'react-icons/lib/fa/dashboard'
import FaLightbulbO from 'react-icons/lib/fa/lightbulb-o'
import FaPlug from 'react-icons/lib/fa/plug'
import FaFeed from 'react-icons/lib/fa/feed'
import FaHddO from 'react-icons/lib/fa/hdd-o'
import FaCog from 'react-icons/lib/fa/cog'

import Lights from 'containers/modules/Lights'

/* eslint-disable  react/display-name */

const routes = [
    { 
        path: '/dashboard',
        exact: true,
        icon: FaDashboard,
        text: 'Dashboard',
        container: () => <div>Dashboard</div>
    },
    { 
        path: '/lights',
        exact: true,
        icon: FaLightbulbO,
        text: 'Lights',
        container: Lights
    },
    { 
        path: '/sockets',
        exact: true,
        icon: FaPlug,
        text: 'Sockets',
        container:  () => <div>Sockets</div>
    },
    { 
        path: '/sensors',
        exact: true,
        icon: FaFeed,
        text: 'Sensors',
        container:  () => <div>Sensors</div>
    },
    { 
        path: '/hub',
        exact: true,
        icon: FaHddO,
        text: 'Hub',
        container:  () => <div>Hub</div>
    },
    { 
        path: '/settings',
        exact: true,
        icon: FaCog,
        text: 'Settings',
        container:  () => <div>Settings</div>
    }
]

/* eslint-enable react/display-name */

export default routes
