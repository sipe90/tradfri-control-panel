
import { ActionReducers, createReducer } from '#/utils'
import { SET_WEBSOCKET_CONNECTION_STATE } from '#/actions/common'

export enum WebsocketConnectionState {
    DISCONNECTED = 0,
    CONNECTED = 1,
    CONNECTION_LOST = 2
}

export interface CommonState {
    websocketConnectionState: WebsocketConnectionState
}

const initialState = {
    websocketConnectionState: WebsocketConnectionState.DISCONNECTED,
}

const reducers: ActionReducers<CommonState> = [
    [SET_WEBSOCKET_CONNECTION_STATE, (state, { payload }) => ({
        ...state,
        websocketConnectionState: payload
    })],
]

export default createReducer(reducers, initialState)
