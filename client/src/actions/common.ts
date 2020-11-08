import { WebsocketConnectionState } from "#/reducers/common"

export const SET_WEBSOCKET_CONNECTION_STATE = "SET_WEBSOCKET_CONNECTION_STATE"

export const setWebsocketConnectionState = (state: WebsocketConnectionState) => ({
    type: SET_WEBSOCKET_CONNECTION_STATE,
    payload: state
})