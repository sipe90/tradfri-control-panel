import * as R from 'ramda'
import { AnyAction, Middleware } from 'redux'
import { IWSPayload } from 'shared/types'

export const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT'
export const WEBSOCKET_SEND = 'WEBSOCKET_SEND'
export const WEBSOCKET_DISCONNECT = 'WEBSOCKET_DISCONNECT'

export const WEBSOCKET_OPEN = 'WEBSOCKET_OPEN'
export const WEBSOCKET_CLOSE = 'WEBSOCKET_CLOSE'
export const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE'
export const WEBSOCKET_ERROR = 'WEBSOCKET_ERROR'

const websocketMiddleware: Middleware = ({ dispatch }) => {

    let websocket: WebSocket | null = null

    return (next) => (action: AnyAction) => {
        const { type: actionType, payload } = action
        R.cond([
            [R.equals(WEBSOCKET_CONNECT), () => {
                websocket = new WebSocket(payload.url)

                websocket.addEventListener('open', () => dispatch({ type: WEBSOCKET_OPEN }))
                websocket.addEventListener('error', () => dispatch({ type: WEBSOCKET_ERROR }))
                websocket.addEventListener('close',
                    ({ code, reason, wasClean }) =>
                        dispatch({
                            type: WEBSOCKET_CLOSE,
                            payload: { code, reason, wasClean }
                        })
                )

                websocket.addEventListener('message', (event) => {
                    dispatch({type: WEBSOCKET_MESSAGE, payload: event})

                    const eventData = event.data
                    if (!eventData) return

                    const { entity, type, data }: IWSPayload = JSON.parse(event.data)

                    if (!entity || !type) return

                    dispatch({
                        type: `${WEBSOCKET_MESSAGE}_${entity.toUpperCase()}_${type.toUpperCase()}`,
                        payload: data
                    })
                })
            }],
            [R.equals(WEBSOCKET_SEND), () => {
                if (!websocket) return
                websocket.send(JSON.stringify(payload))
            }],
            [R.equals(WEBSOCKET_DISCONNECT), () => {
                if (!websocket) return
                websocket.close(payload || 1000)
                websocket = null
            }],
            [R.T, () => next(action)],
        ])(actionType)
    }
}

export default websocketMiddleware
