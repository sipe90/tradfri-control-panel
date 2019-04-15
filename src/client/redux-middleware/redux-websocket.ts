import * as R from 'ramda'
import { AnyAction, Dispatch, Middleware } from 'redux'

export const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT'
export const WEBSOCKET_SEND = 'WEBSOCKET_SEND'
export const WEBSOCKET_DISCONNECT = 'WEBSOCKET_DISCONNECT'

export const WEBSOCKET_OPEN = 'WEBSOCKET_OPEN'
export const WEBSOCKET_CLOSE = 'WEBSOCKET_CLOSE'
export const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE'
export const WEBSOCKET_ERROR = 'WEBSOCKET_ERROR'

export type MessageHandler<D extends Dispatch<AnyAction>> = (dispatch: D, event: MessageEvent) => void

const createWebsocketMiddleware = <D extends Dispatch<AnyAction> = Dispatch<AnyAction>>
    (handler: MessageHandler<D>): Middleware<{}, any, D> => ({ dispatch }) => {

    let websocket: WebSocket | null = null

    return (next) => (action: AnyAction) => {
        const { type: actionType, payload } = action
        R.cond([
            [R.equals(WEBSOCKET_CONNECT), () => {
                websocket = new WebSocket(payload.url)

                websocket.addEventListener('open', (_event) => dispatch(open()))
                websocket.addEventListener('error', (_event) => dispatch(error()))
                websocket.addEventListener('close', (event) => {
                    dispatch(close(event))
                    websocket = null
                })

                websocket.addEventListener('message', (event) => {
                    dispatch(message(event))
                    handler(dispatch, event)
                })
            }],
            [R.equals(WEBSOCKET_SEND), () => {
                if (!websocket) return
                websocket.send(JSON.stringify(payload))
            }],
            [R.equals(WEBSOCKET_DISCONNECT), () => {
                if (!websocket) return
                websocket.close(payload.code || 1000)
                websocket = null
            }],
            [R.T, () => next(action)],
        ])(actionType)
    }
}

export const connect = (url: string) => ({
    type: WEBSOCKET_CONNECT,
    payload: { url }
})

export const disconnect = (code?: number) => ({
    type: WEBSOCKET_DISCONNECT,
    payload: { code }
})

export const send = (data: any) => ({
    type: WEBSOCKET_SEND,
    payload: data
})

const open = () => ({
    type: WEBSOCKET_OPEN
})

const error = () => ({
    type: WEBSOCKET_ERROR
})

const message = (event: MessageEvent) => ({
    type: WEBSOCKET_MESSAGE,
    payload: event
})

const close = (event: CloseEvent) => ({
    type: WEBSOCKET_CLOSE,
    payload: event
})

export default createWebsocketMiddleware
