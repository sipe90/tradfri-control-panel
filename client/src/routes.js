import React from 'react'

import FaDashboard from 'react-icons/lib/fa/dashboard'
import FaLightbulbO from 'react-icons/lib/fa/lightbulb-o'
import FaPlug from 'react-icons/lib/fa/plug'
import FaFeed from 'react-icons/lib/fa/feed'
import FaHddO from 'react-icons/lib/fa/hdd-o'
import FaCog from 'react-icons/lib/fa/cog'

/* eslint-disable  react/display-name */

const routes = [
    { 
        path: '/dashboard',
        exact: true,
        icon: FaDashboard,
        text: 'Dashboard',
        component: () => <div>Dashboard</div>
    },
    { 
        path: '/lights',
        exact: true,
        icon: FaLightbulbO,
        text: 'Lights',
        component:  () => <div>Lights</div>
    },
    { 
        path: '/sockets',
        exact: true,
        icon: FaPlug,
        text: 'Sockets',
        component:  () => <div>Sockets</div>
    },
    { 
        path: '/sensors',
        exact: true,
        icon: FaFeed,
        text: 'Sensors',
        component:  () => <div>Sensors</div>
    },
    { 
        path: '/hub',
        exact: true,
        icon: FaHddO,
        text: 'Hub',
        component:  () => <div>Hub</div>
    },
    { 
        path: '/settings',
        exact: true,
        icon: FaCog,
        text: 'Settings',
        component:  () => <div>Settings</div>
    }
]

/* eslint-enable react/display-name: 2 */

export default routes
