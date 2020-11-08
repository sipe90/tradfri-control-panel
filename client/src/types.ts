import { AppState } from '@/reducers'
import { Action, AnyAction } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'

export interface PayloadAction<P = any, T = any> extends Action<T> {
    payload?: P
}

export type AppDispatch = ThunkDispatch<AppState, undefined, AnyAction>

export type ThunkResult<R = void, A extends Action = PayloadAction> = ThunkAction<R, AppState, undefined, A>
export type AsyncThunkResult<R = void, A extends Action = PayloadAction> = ThunkResult<Promise<R>, A>
