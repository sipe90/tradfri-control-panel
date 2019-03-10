import { message } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import App from '@/containers/App'
import reducers from '@/reducers'
import timerMiddleware from '@/redux-middleware/redux-timers'
import webSocketMiddleware from '@/redux-middleware/redux-websocket'

message.config({
    duration: 3,
    maxCount: 3,
    top: 72,
})

const loggerMiddleware = createLogger()

const store = createStore(
    reducers,
    applyMiddleware(
        thunkMiddleware,
        webSocketMiddleware,
        timerMiddleware,
        loggerMiddleware,
    ),
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
)
