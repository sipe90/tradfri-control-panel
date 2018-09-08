import React from 'react'
import ReactDOM from 'react-dom'
import App from 'containers/App'
import registerServiceWorker from 'registerServiceWorker'
import { message } from 'antd'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import timerMiddleware from 'redux-timers'
import reducers from 'reducers'

message.config({
    top: 72,
    duration: 3,
    maxCount: 3,
})

const loggerMiddleware = createLogger()

const store = createStore(
    reducers,
    applyMiddleware(
        loggerMiddleware,
        thunkMiddleware,
        timerMiddleware
    )
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

registerServiceWorker()
