import React from 'react'
import ReactDOM from 'react-dom'
import App from 'containers/App'
import registerServiceWorker from 'registerServiceWorker'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import reducers from 'reducers'

const loggerMiddleware = createLogger()

const store = createStore(
    reducers,
    applyMiddleware(
        loggerMiddleware, 
        thunkMiddleware
    )
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

registerServiceWorker()
