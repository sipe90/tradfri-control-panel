import { Action, AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

export interface IPayloadAction<P = any, T = any> extends Action<T> {
    payload?: P
}

// TODO: State type
export type ThunkResult<R = void, A extends Action<any> = AnyAction> = ThunkAction<R, any, undefined, A>

export interface INormalizeResult {
    result: any
    entities: any
}

export interface IErrorResponse {
    message: string
}

export interface IConnectionTestResult {
    success: boolean
    error: string | null
}
