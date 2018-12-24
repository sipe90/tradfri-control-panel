import { Action, AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk';

export interface PayloadAction<P = any, T = any> extends Action<T> {
    payload?: P
}

// TODO: State type
export type ThunkResult<R = void, A extends Action<any> = AnyAction> = ThunkAction<R, any, undefined, A>;

export interface NormalizeResult {
    result: any
    entities: any
}

export interface ErrorResponse {
    message: string
}

export interface ConnectionTestResult {
    success: boolean
    error: string | null
}
