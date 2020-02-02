import { message } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools   } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import App from '@/containers/App'
import reducers from '@/reducers'
import timerMiddleware from '@/redux-middleware/redux-timers'
import createWebSocketMiddleware, { connect } from '@/redux-middleware/redux-websocket'
import { Payloads } from 'shared/types/websocket'
import { fetchGateway } from './actions/gateway'
import { fetchGroups } from './actions/groups'
import { fetchLights } from './actions/lights'
import { fetchSensors } from './actions/sensors'
import { AppDispatch } from './types'
import { setWebsocketConnectionState } from './actions/common'
import { WebsocketConnectionState } from './reducers/common'

message.config({
    duration: 3,
    maxCount: 3,
    top: 72,
})

const loggerMiddleware = createLogger()

const webSocketMiddleware = createWebSocketMiddleware<AppDispatch>({
    onMessage: (dispatch, event) => {
        const eventData = event.data
        if (!eventData) return

        const { entity, type }: Payloads = JSON.parse(event.data)

        if (typeof entity !== 'string' || typeof type !== 'string') return

        // TODO: More sophisticated handling for individual device updates
        switch (entity) {
            case 'gateway':
                return dispatch(fetchGateway())
            case 'group':
                return dispatch(fetchGroups())
            case 'light':
                return dispatch(fetchLights())
            case 'sensor':
                return dispatch(fetchSensors())
            case 'scene':
                return dispatch(fetchGroups())
        }
    },
    onConnect: (dispatch) => {
        dispatch(setWebsocketConnectionState(WebsocketConnectionState.CONNECTED))
    },
    onClose: (dispatch, event) => {
        if (!event.wasClean) {
            dispatch(setWebsocketConnectionState(WebsocketConnectionState.CONNECTION_LOST))
            dispatch(connect(`ws://${window.location.hostname}:${window.location.port}/ws`))
        } else {
            dispatch(setWebsocketConnectionState(WebsocketConnectionState.DISCONNECTED))
        }
    }
})

const store = createStore(
    reducers,
    composeWithDevTools (
    applyMiddleware(
        thunkMiddleware,
        webSocketMiddleware,
        timerMiddleware,
        loggerMiddleware,
    )),
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
)
