import * as R from 'ramda'
import { Action, AnyAction, Dispatch, Middleware } from 'redux'

const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT'
const WEBSOCKET_SEND = 'WEBSOCKET_SEND'
const WEBSOCKET_DISCONNECT = 'WEBSOCKET_DISCONNECT'

const WEBSOCKET_OPEN = 'WEBSOCKET_OPEN'
const WEBSOCKET_CLOSE = 'WEBSOCKET_CLOSE'
const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE'
const WEBSOCKET_ERROR = 'WEBSOCKET_ERROR'

type EventHandler<D extends Dispatch<AnyAction>, E extends Event> = (dispatch: D, event: E) => void

export type MessageHandler<D extends Dispatch<AnyAction>> = EventHandler<D, MessageEvent>
export type CloseHandler<D extends Dispatch<AnyAction>> = EventHandler<D, CloseEvent>

const createWebsocketMiddleware = <D extends Dispatch<AnyAction> = Dispatch<AnyAction>>
    (handler: MessageHandler<D>, closeHandler?: CloseHandler<D>): Middleware<{}, any, D> => ({ dispatch }) => {

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
                    typeof closeHandler === 'function' && closeHandler(dispatch, event)
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

interface IConnectAction extends Action<typeof WEBSOCKET_CONNECT> {
    payload: { url: string }
}
interface IDisconnectAction extends Action<typeof WEBSOCKET_DISCONNECT> {
    payload: { code?: number }
}
interface ISendAction extends Action<typeof WEBSOCKET_SEND> {
    payload: { data: any }
}
type OpenAction = Action<typeof WEBSOCKET_OPEN>
type ErrorAction = Action<typeof WEBSOCKET_ERROR>
interface IMessageAction extends Action<typeof WEBSOCKET_MESSAGE> {
    payload: MessageEvent
}
interface ICloseAction extends Action<typeof WEBSOCKET_CLOSE> {
    payload: CloseEvent
}

export const connect = (url: string): IConnectAction => ({
    type: WEBSOCKET_CONNECT,
    payload: { url }
})

export const disconnect = (code?: number): IDisconnectAction => ({
    type: WEBSOCKET_DISCONNECT,
    payload: { code }
})

export const send = (data: any): ISendAction => ({
    type: WEBSOCKET_SEND,
    payload: data
})

const open = (): OpenAction => ({
    type: WEBSOCKET_OPEN
})

const error = (): ErrorAction => ({
    type: WEBSOCKET_ERROR
})

const message = (event: MessageEvent): IMessageAction => ({
    type: WEBSOCKET_MESSAGE,
    payload: event
})

const close = (event: CloseEvent): ICloseAction => ({
    type: WEBSOCKET_CLOSE,
    payload: event
})

export default createWebsocketMiddleware
