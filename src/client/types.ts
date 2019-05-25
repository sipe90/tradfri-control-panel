import { IAppState } from '@/reducers'
import { Action, AnyAction } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'

export interface IPayloadAction<P = any, T = any> extends Action<T> {
    payload?: P
}

export type AppDispatch = ThunkDispatch<IAppState, undefined, AnyAction>

export type ThunkResult<R = void, A extends Action = IPayloadAction> = ThunkAction<R, IAppState, undefined, A>
export type AsyncThunkResult<R = void, A extends Action = IPayloadAction> = ThunkResult<Promise<R>, A>

export interface IErrorResponse {
    message: string
}

export interface IConnectionTestResult {
    success: boolean
    error: string | null
}
